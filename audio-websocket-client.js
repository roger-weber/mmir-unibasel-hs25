// Audio WebSocket Streaming Client

class AudioStreamPlayer {
  constructor(socketUrl) {
    this.socket = io(socketUrl);
    this.audioContext = null;
    this.audioQueue = [];
    this.isPlaying = false;
    this.bufferSize = 2048;
    
    this.initAudioContext();
    this.setupSocketListeners();
  }
  
  initAudioContext() {
    // Create audio context on user interaction to comply with browser autoplay policies
    const initAudio = () => {
      if (this.audioContext) return;
      
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 24000 // Adjust based on your audio stream's sample rate
      });
      
      document.removeEventListener('click', initAudio);
      document.removeEventListener('touchstart', initAudio);
      console.log('AudioContext initialized');
    };
    
    document.addEventListener('click', initAudio);
    document.addEventListener('touchstart', initAudio);
  }
  
  setupSocketListeners() {
    // Listen for audio data from the server
    this.socket.on('audioOutput', (audioData) => {
      if (!this.audioContext) return;
      
      // Convert base64 string to ArrayBuffer if needed
      let audioBuffer;
      if (typeof audioData === 'string') {
        const binaryString = window.atob(audioData);
        audioBuffer = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          audioBuffer[i] = binaryString.charCodeAt(i);
        }
      } else if (audioData instanceof Uint8Array) {
        audioBuffer = audioData;
      } else {
        console.error('Unsupported audio data format');
        return;
      }
      
      // Add to queue and play if not already playing
      this.audioQueue.push(audioBuffer);
      if (!this.isPlaying) {
        this.playNextAudio();
      }
    });
    
    this.socket.on('streamComplete', () => {
      console.log('Audio stream completed');
    });
    
    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }
  
  async playNextAudio() {
    if (this.audioQueue.length === 0) {
      this.isPlaying = false;
      return;
    }
    
    this.isPlaying = true;
    const audioData = this.audioQueue.shift();
    
    try {
      // Decode the audio data
      const audioBuffer = await this.audioContext.decodeAudioData(audioData.buffer);
      
      // Create source node
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      
      // Play the audio and chain to the next chunk when done
      source.onended = () => this.playNextAudio();
      source.start();
    } catch (error) {
      console.error('Error decoding audio:', error);
      this.playNextAudio(); // Skip problematic chunk
    }
  }
  
  // Method to send audio to the server (for bidirectional communication)
  sendAudio(audioBlob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result;
        const base64 = btoa(
          new Uint8Array(arrayBuffer)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        this.socket.emit('audioInput', base64);
        resolve();
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(audioBlob);
    });
  }
  
  // Clean up resources
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

// Usage example:
// const audioPlayer = new AudioStreamPlayer('http://localhost:3000');
// 
// // To send audio (e.g., from microphone):
// navigator.mediaDevices.getUserMedia({ audio: true })
//   .then(stream => {
//     const mediaRecorder = new MediaRecorder(stream);
//     mediaRecorder.ondataavailable = async (event) => {
//       if (event.data.size > 0) {
//         await audioPlayer.sendAudio(event.data);
//       }
//     };
//     mediaRecorder.start(100); // Collect 100ms chunks
//   });