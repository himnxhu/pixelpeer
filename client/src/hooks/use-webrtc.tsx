import { useState, useRef, useCallback, useEffect } from "react";
import Peer from "simple-peer";

export function useWebRTC() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [connectionState, setConnectionState] = useState<'new' | 'connecting' | 'connected' | 'disconnected'>('new');
  
  const peerRef = useRef<Peer.Instance | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Initialize media stream
  const initializeMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      console.log('Local stream initialized:', stream);
      setLocalStream(stream);
      localStreamRef.current = stream;
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }, []);

  // Create peer connection
  const createPeer = useCallback(async (initiator: boolean) => {
    if (!localStreamRef.current) {
      await initializeMedia();
    }

    console.log('Creating peer connection, initiator:', initiator);

    const peer = new Peer({
      initiator,
      trickle: false,
      stream: localStreamRef.current || undefined,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ]
      }
    });

    peer.on('error', (error: any) => {
      console.error('Peer error:', error);
      setConnectionState('disconnected');
    });

    peer.on('connect', () => {
      console.log('Peer connected successfully');
      console.log('Setting connection state to connected');
      setConnectionState('connected');
    });

    peer.on('stream', (stream: MediaStream) => {
      console.log('Received remote stream:', stream);
      console.log('Remote stream tracks:', stream.getTracks());
      console.log('Remote stream active:', stream.active);
      setRemoteStream(stream);
    });

    peer.on('close', () => {
      console.log('Peer connection closed');
      console.log('Setting connection state to disconnected');
      setConnectionState('disconnected');
      setRemoteStream(null);
    });

    peer.on('signal', (data: any) => {
      console.log('Peer signal event:', data.type);
    });

    peer.on('iceStateChange', (state: any) => {
      console.log('ICE connection state changed:', state);
    });

    peer.on('connectionStateChange', (state: any) => {
      console.log('Connection state changed:', state);
    });

    peerRef.current = peer;
    setConnectionState('connecting');
    
    return peer;
  }, [initializeMedia]);

  // Create offer (for initiator)
  const createOffer = useCallback(async (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        const peer = await createPeer(true);
        
        // Wait for the first signal event which will be the offer
        const handleSignal = (data: any) => {
          console.log('Creating offer signal:', data);
          peer.off('signal', handleSignal);
          resolve(data);
        };
        
        peer.on('signal', handleSignal);
        peer.on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  }, [createPeer]);

  // Create answer (for non-initiator)
  const createAnswer = useCallback(async (offer: any): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        const peer = await createPeer(false);
        
        // Wait for the first signal event which will be the answer
        const handleSignal = (data: any) => {
          console.log('Creating answer signal:', data);
          peer.off('signal', handleSignal);
          resolve(data);
        };
        
        peer.on('signal', handleSignal);
        peer.on('error', reject);
        
        console.log('Signaling with offer:', offer);
        peer.signal(offer);
      } catch (error) {
        reject(error);
      }
    });
  }, [createPeer]);

  // Add answer to peer connection
  const addAnswer = useCallback((answer: any) => {
    console.log('Adding answer to peer:', answer);
    if (peerRef.current) {
      peerRef.current.signal(answer);
    }
  }, []);

  // Add ICE candidate
  const addIceCandidate = useCallback((candidate: any) => {
    console.log('Adding ICE candidate:', candidate);
    if (peerRef.current) {
      peerRef.current.signal(candidate);
    }
  }, []);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        console.log('Video toggled:', videoTrack.enabled);
      }
    }
  }, []);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
        console.log('Audio toggled:', audioTrack.enabled);
      }
    }
  }, []);

  // Cleanup
  const cleanup = useCallback(() => {
    console.log('Cleaning up WebRTC connections');
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    setLocalStream(null);
    setRemoteStream(null);
    setConnectionState('disconnected');
  }, []);

  // Initialize media stream on mount
  useEffect(() => {
    initializeMedia().catch(console.error);
    
    return cleanup;
  }, [initializeMedia, cleanup]);

  return {
    localStream,
    remoteStream,
    isVideoEnabled,
    isAudioEnabled,
    connectionState,
    createOffer,
    createAnswer,
    addAnswer,
    addIceCandidate,
    toggleVideo,
    toggleAudio,
    cleanup
  };
}
