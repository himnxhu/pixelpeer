import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ChatPanel from "./chat-panel";
import { Video, VideoOff, Mic, MicOff, Phone, SkipForward, Maximize2, Settings } from "lucide-react";

interface VideoCallInterfaceProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  connectionStatus: 'disconnected' | 'connecting' | 'connected';
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onEndCall: () => void;
  onNextChat: () => void;
  onSendMessage: (message: string) => void;
  roomId: string | null;
}

export default function VideoCallInterface({
  localStream,
  remoteStream,
  isVideoEnabled,
  isAudioEnabled,
  connectionStatus,
  onToggleVideo,
  onToggleAudio,
  onEndCall,
  onNextChat,
  onSendMessage,
  roomId
}: VideoCallInterfaceProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [connectionQuality, setConnectionQuality] = useState('Excellent');

  // Set up local video stream
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      console.log('Setting local video stream:', localStream);
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Set up remote video stream
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      console.log('Setting remote video stream:', remoteStream);
      console.log('Remote stream tracks:', remoteStream.getTracks());
      console.log('Remote stream active:', remoteStream.active);
      
      remoteVideoRef.current.srcObject = remoteStream;
      
      // Ensure the video plays
      remoteVideoRef.current.onloadedmetadata = () => {
        console.log('Remote video metadata loaded');
        remoteVideoRef.current?.play().catch(console.error);
      };
      
      remoteVideoRef.current.oncanplay = () => {
        console.log('Remote video can play');
      };
      
      remoteVideoRef.current.onplay = () => {
        console.log('Remote video started playing');
      };
      
      remoteVideoRef.current.onerror = (error: Event | string) => {
        console.error('Remote video error:', error);
      };
      
      // Force play attempt
      setTimeout(() => {
        if (remoteVideoRef.current && remoteVideoRef.current.paused) {
          console.log('Attempting to play remote video...');
          remoteVideoRef.current.play().catch(console.error);
        }
      }, 1000);
    }
  }, [remoteStream]);

  const toggleFullscreen = () => {
    if (remoteVideoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        remoteVideoRef.current.requestFullscreen();
      }
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      default: return 'bg-red-500';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      default: return 'Disconnected';
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-600 px-4 py-3 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Video className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-white">PixelMeet</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-dark-700 px-3 py-1 rounded-full">
              <div className={`w-2 h-2 rounded-full animate-pulse ${getConnectionStatusColor()}`}></div>
              <span className="text-sm text-gray-300">{getConnectionStatusText()}</span>
            </div>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
            
            {/* Video Section */}
            <div className="xl:col-span-3 space-y-4">
              {/* Remote Video */}
              <div className="relative bg-dark-800 rounded-2xl overflow-hidden shadow-2xl max-h-[600px] aspect-video">
                {/* Placeholder when no remote connection */}
                {!remoteStream && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-dark-700 to-dark-800">
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 bg-dark-600 rounded-full flex items-center justify-center mx-auto">
                        <div className="w-12 h-12 bg-gray-400 rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-300">
                          {connectionStatus === 'connecting' 
                            ? 'Looking for someone to chat with...' 
                            : 'Waiting for connection...'}
                        </p>
                        {connectionStatus === 'connecting' && (
                          <div className="flex items-center justify-center space-x-1 mt-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Remote Video Element */}
                <video 
                  ref={remoteVideoRef}
                  className={`w-full h-full object-cover ${remoteStream ? 'block' : 'hidden'}`}
                  autoPlay 
                  playsInline
                />

                {/* Debug Info Overlay */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
                    <div>Status: {connectionStatus}</div>
                    <div>Local Stream: {localStream ? 'Yes' : 'No'}</div>
                    <div>Remote Stream: {remoteStream ? 'Yes' : 'No'}</div>
                    <div>Connection State: {connectionStatus}</div>
                    {remoteStream && (
                      <div>Remote Tracks: {remoteStream.getTracks().length}</div>
                    )}
                    {localStream && (
                      <div>Local Tracks: {localStream.getTracks().length}</div>
                    )}
                  </div>
                )}

                {/* Local Video Overlay - Show if we have local stream or are connected */}
                {(localStream || connectionStatus === 'connected') && (
                  <div className="absolute top-4 right-4 w-32 h-24 bg-dark-800 rounded-lg overflow-hidden shadow-lg border-2 border-white">
                    <video 
                      ref={localVideoRef}
                      className="w-full h-full object-cover"
                      autoPlay 
                      muted 
                      playsInline
                    />
                    <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 px-1 py-0.5 rounded text-xs">
                      You
                    </div>
                  </div>
                )}

                {/* Remote Video Overlay Controls */}
                {remoteStream && (
                  <>
                    <div className="absolute top-4 left-4 flex items-center space-x-2">
                      <div className="bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        <span>{connectionQuality}</span>
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white"
                        onClick={toggleFullscreen}
                      >
                        <Maximize2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>

              {/* Call Controls */}
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`w-12 h-12 rounded-xl transition-all ${
                    isVideoEnabled 
                      ? 'bg-dark-700 hover:bg-dark-600 text-white' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                  onClick={onToggleVideo}
                >
                  {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className={`w-12 h-12 rounded-xl transition-all ${
                    isAudioEnabled 
                      ? 'bg-dark-700 hover:bg-dark-600 text-white' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                  onClick={onToggleAudio}
                >
                  {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 bg-red-600 hover:bg-red-700 rounded-xl text-white transition-all"
                  onClick={onEndCall}
                >
                  <Phone className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white transition-all"
                  onClick={onNextChat}
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Chat Panel */}
            <div className="xl:col-span-1">
              <ChatPanel 
                onSendMessage={onSendMessage}
                roomId={roomId}
                isConnected={connectionStatus === 'connected'}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
