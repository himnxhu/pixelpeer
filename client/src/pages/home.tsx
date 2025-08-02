import { useState, useEffect } from "react";
import VideoCallInterface from "@/components/video-call-interface";
import WelcomeScreen from "@/components/welcome-screen";
import ConnectionModal from "@/components/connection-modal";
import { useSocket } from "@/hooks/use-socket";
import { useWebRTC } from "@/hooks/use-webrtc";

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'connecting' | 'connected'>('welcome');
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [peerId, setPeerId] = useState<string | null>(null);

  const { socket, isConnected: socketConnected, sendMessage } = useSocket();
  const { 
    localStream, 
    remoteStream, 
    isVideoEnabled, 
    isAudioEnabled,
    toggleVideo,
    toggleAudio,
    createOffer,
    createAnswer,
    addAnswer,
    addIceCandidate,
    cleanup
  } = useWebRTC();

  // Handle socket messages
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'waiting-for-peer':
            setConnectionStatus('connecting');
            setCurrentScreen('connecting');
            setRoomId(data.roomId);
            setPeerId(data.peerId);
            break;
            
          case 'peer-found':
            setConnectionStatus('connected');
            setCurrentScreen('connected');
            setRoomId(data.roomId);
            setPeerId(data.peerId);
            
            // If we're peer1, create offer
            if (data.peerId === 'peer1') {
              createOffer().then(offer => {
                sendMessage({
                  type: 'webrtc-offer',
                  offer: offer
                });
              });
            }
            break;
            
          case 'webrtc-offer':
            createAnswer(data.offer).then(answer => {
              sendMessage({
                type: 'webrtc-answer',
                answer: answer
              });
            });
            break;
            
          case 'webrtc-answer':
            addAnswer(data.answer);
            break;
            
          case 'webrtc-ice-candidate':
            addIceCandidate(data.candidate);
            break;
            
          case 'peer-disconnected':
            handleDisconnect();
            break;
            
          case 'error':
            console.error('Socket error:', data.message);
            break;
        }
      } catch (error) {
        console.error('Error parsing socket message:', error);
      }
    };

    socket.addEventListener('message', handleMessage);
    return () => socket.removeEventListener('message', handleMessage);
  }, [socket, sendMessage, createOffer, createAnswer, addAnswer, addIceCandidate]);

  const handleStartChat = async () => {
    if (!socketConnected) {
      console.error('Socket not connected');
      return;
    }

    try {
      // Request media permissions
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      
      setCurrentScreen('connecting');
      setConnectionStatus('connecting');
      
      // Find peer
      sendMessage({ type: 'find-peer' });
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Please allow camera and microphone access to start chatting');
    }
  };

  const handleDisconnect = () => {
    cleanup();
    setConnectionStatus('disconnected');
    setCurrentScreen('welcome');
    setRoomId(null);
    setPeerId(null);
  };

  const handleNextChat = () => {
    handleDisconnect();
    // Small delay before starting new chat
    setTimeout(() => {
      handleStartChat();
    }, 500);
  };

  const handleEndCall = () => {
    if (socket && roomId) {
      sendMessage({ type: 'disconnect' });
    }
    handleDisconnect();
  };

  const handleSendChatMessage = (message: string) => {
    if (socket && roomId) {
      sendMessage({
        type: 'chat-message',
        content: message
      });
    }
  };

  if (currentScreen === 'welcome') {
    return <WelcomeScreen onStartChat={handleStartChat} />;
  }

  if (currentScreen === 'connecting') {
    return (
      <ConnectionModal
        isOpen={true}
        onCancel={handleDisconnect}
        status="connecting"
      />
    );
  }

  return (
    <VideoCallInterface
      localStream={localStream}
      remoteStream={remoteStream}
      isVideoEnabled={isVideoEnabled}
      isAudioEnabled={isAudioEnabled}
      connectionStatus={connectionStatus}
      onToggleVideo={toggleVideo}
      onToggleAudio={toggleAudio}
      onEndCall={handleEndCall}
      onNextChat={handleNextChat}
      onSendMessage={handleSendChatMessage}
      roomId={roomId}
    />
  );
}
