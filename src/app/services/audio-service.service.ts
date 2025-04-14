import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioServiceService
{
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private audioBlob!:Blob;
  constructor() {}

  /**
   * Checks if an audio input device is available.
   */
  private async isAudioDeviceAvailable(): Promise<boolean> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.some(device => device.kind === 'audioinput');
    } catch (error) {
      console.error('Error checking audio devices:', error);
      return false;
    }
  }

  /**
   * Starts recording audio if an input device is available.
   * @param playback - The HTML audio element to play the recorded audio.
   */
  async startRecording(playback: any,audioAdvice:any): Promise<void> {
    if (!(await this.isAudioDeviceAvailable())) {
      throw new Error('No audio input device found');
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = event => this.audioChunks.push(event.data);

      this.mediaRecorder.onstop =  () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.audioBlob=audioBlob;
        playback.src = URL.createObjectURL(audioBlob);
        console.log(audioBlob);
         this.convertBlobToBytes(audioBlob,audioAdvice);
        this.cleanup(); 
      };

      this.mediaRecorder.start();
    } catch (error) {
      console.error('Error starting recording:', error);
      this.cleanup();
      throw error;
    }
  }

  /**
   * Stops the recording if it is active.
   */
  async stopRecording(): Promise<Blob> {
    if (!this.mediaRecorder || this.mediaRecorder.state !== 'recording') {
      throw new Error('No active recording to stop');
    }
    this.mediaRecorder.stop();
    return this.audioBlob;
  }

  /**
   * Converts a Blob to an ArrayBuffer (byte array).
   * @param blob - The recorded audio Blob.
   */
  private  convertBlobToBytes(blob: Blob,audioAdvice:any): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      audioAdvice.setValue(Array.from(new Uint8Array(reader.result as ArrayBuffer)));
    };
    reader.readAsArrayBuffer(blob);
  }

  /**
   * Cleans up media stream and recorder resources.
   */
  private cleanup(): void {
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
  }
}
