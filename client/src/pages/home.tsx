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
    connectionState,
    toggleVideo,
    toggleAudio,
    createOffer,
    createAnswer,
    addAnswer,
    addIceCandidate,
    cleanup
  } = useWebRTC();

  // Update connection status based on WebRTC state
  useEffect(() => {
    console.log('WebRTC connection state changed:', connectionState);
    if (connectionState === 'connected') {
      setConnectionStatus('connected');
      console.log('Setting connection status to connected');
    } else if (connectionState === 'connecting') {
      setConnectionStatus('connecting');
      console.log('Setting connection status to connecting');
    } else if (connectionState === 'disconnected') {
      setConnectionStatus('disconnected');
      console.log('Setting connection status to disconnected');
    }
  }, [connectionState]);

  // Handle socket messages
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received socket message:', data);
        
        switch (data.type) {
          case 'waiting-for-peer':
            setConnectionStatus('connecting');
            setCurrentScreen('connecting');
            setRoomId(data.roomId);
            setPeerId(data.peerId);
            break;
            
          case 'peer-found':
            console.log('Peer found, creating WebRTC connection');
            setConnectionStatus('connecting');
            setCurrentScreen('connected');
            setRoomId(data.roomId);
            setPeerId(data.peerId);
            
            // If we're peer1, create offer
            if (data.peerId === 'peer1') {
              console.log('Creating offer as peer1');
              createOffer().then(offer => {
                console.log('Sending offer:', offer);
                sendMessage({
                  type: 'webrtc-offer',
                  offer: offer
                });
              }).catch(error => {
                console.error('Error creating offer:', error);
              });
            }
            break;
            
          case 'webrtc-offer':
            console.log('Received offer, creating answer');
            createAnswer(data.offer).then(answer => {
              console.log('Sending answer:', answer);
              sendMessage({
                type: 'webrtc-answer',
                answer: answer
              });
            }).catch(error => {
              console.error('Error creating answer:', error);
            });
            break;
            
          case 'webrtc-answer':
            console.log('Received answer, adding to peer');
            addAnswer(data.answer);
            break;
            
          case 'webrtc-ice-candidate':
            console.log('Received ICE candidate, adding to peer');
            addIceCandidate(data.candidate);
            break;
            
          case 'peer-disconnected':
            console.log('Peer disconnected');
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
      alert('WebSocket connection failed. Please refresh the page.');
      return;
    }

    try {
      console.log('Starting chat - requesting media permissions...');
      // Request media permissions
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      console.log('Media permissions granted successfully');
      
      setCurrentScreen('connecting');
      setConnectionStatus('connecting');
      
      // Find peer
      console.log('Sending find-peer message to server...');
      const success = sendMessage({ type: 'find-peer' });
      console.log('Find-peer message sent:', success);
      
      if (!success) {
        console.error('Failed to send find-peer message');
        alert('Failed to connect to server. Please refresh the page.');
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Please allow camera and microphone access to start chatting');
    }
  };

  const handleDisconnect = () => {
    console.log('Disconnecting...');
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
