import { Injectable } from '@angular/core';
import { assert } from '@shared/domain';

export type RecorderResult = { file: (name: string) => File };

@Injectable({ providedIn: 'root' })
export class RecorderService {
  private mediaRecorder = new MediaRecorder(new MediaStream());
  private recordedChunks: Blob[] = [];

  public async start(): Promise<void> {
    assert(this.mediaRecorder.state === 'inactive', 'Already recording');

    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    this.mediaRecorder = new MediaRecorder(stream);
    this.recordedChunks = [];

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.start();
  }

  public stop(): Promise<RecorderResult> {
    assert(this.mediaRecorder.state === 'recording', 'No recording in progress');

    return new Promise((resolve) => {
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        resolve({ file: (name: string) => new File([blob], `${name}.webm`, { type: 'video/webm' }) });
      };

      this.mediaRecorder.stop();
    });
  }
}

export const recording = (cb: (recorder: RecorderService) => void) => {
  const recorderService = new RecorderService();
  recorderService.start().then(() => cb(recorderService));
};
