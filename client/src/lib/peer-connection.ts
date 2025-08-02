interface PeerConnectionConfig {
  iceServers: RTCIceServer[];
}

interface PeerConnectionCallbacks {
  onIceCandidate?: (candidate: RTCIceCandidate) => void;
  onRemoteStream?: (stream: MediaStream) => void;
  onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
  onDataChannel?: (channel: RTCDataChannel) => void;
}

export class PeerConnectionManager {
  private pc: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private callbacks: PeerConnectionCallbacks = {};

  constructor(
    config: PeerConnectionConfig = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ]
    },
    callbacks: PeerConnectionCallbacks = {}
  ) {
    this.callbacks = callbacks;
    this.initializePeerConnection(config);
  }

  private initializePeerConnection(config: PeerConnectionConfig) {
    this.pc = new RTCPeerConnection(config);

    this.pc.onicecandidate = (event) => {
      if (event.candidate && this.callbacks.onIceCandidate) {
        this.callbacks.onIceCandidate(event.candidate);
      }
    };

    this.pc.ontrack = (event) => {
      if (event.streams[0] && this.callbacks.onRemoteStream) {
        this.callbacks.onRemoteStream(event.streams[0]);
      }
    };

    this.pc.onconnectionstatechange = () => {
      if (this.pc && this.callbacks.onConnectionStateChange) {
        this.callbacks.onConnectionStateChange(this.pc.connectionState);
      }
    };

    this.pc.ondatachannel = (event) => {
      if (this.callbacks.onDataChannel) {
        this.callbacks.onDataChannel(event.channel);
      }
    };
  }

  async setLocalStream(stream: MediaStream) {
    this.localStream = stream;
    if (this.pc) {
      stream.getTracks().forEach(track => {
        this.pc!.addTrack(track, stream);
      });
    }
  }

  async createOffer(): Promise<RTCSessionDescriptionInit> {
    if (!this.pc) throw new Error('Peer connection not initialized');
    
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    return offer;
  }

  async createAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    if (!this.pc) throw new Error('Peer connection not initialized');
    
    await this.pc.setRemoteDescription(offer);
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);
    return answer;
  }

  async setRemoteAnswer(answer: RTCSessionDescriptionInit) {
    if (!this.pc) throw new Error('Peer connection not initialized');
    await this.pc.setRemoteDescription(answer);
  }

  async addIceCandidate(candidate: RTCIceCandidateInit) {
    if (!this.pc) throw new Error('Peer connection not initialized');
    await this.pc.addIceCandidate(candidate);
  }

  createDataChannel(label: string, options?: RTCDataChannelInit): RTCDataChannel {
    if (!this.pc) throw new Error('Peer connection not initialized');
    return this.pc.createDataChannel(label, options);
  }

  getConnectionState(): RTCPeerConnectionState | null {
    return this.pc ? this.pc.connectionState : null;
  }

  close() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    
    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }
  }
}

export function createMediaConstraints(options: {
  video?: boolean | MediaTrackConstraints;
  audio?: boolean | MediaTrackConstraints;
} = {}) {
  return {
    video: options.video !== false ? {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: { ideal: 30 },
      ...((typeof options.video === 'object') ? options.video : {})
    } : false,
    audio: options.audio !== false ? {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      ...((typeof options.audio === 'object') ? options.audio : {})
    } : false
  };
}

export async function getUserMedia(constraints?: MediaStreamConstraints): Promise<MediaStream> {
  const defaultConstraints = createMediaConstraints();
  return navigator.mediaDevices.getUserMedia(constraints || defaultConstraints);
}
