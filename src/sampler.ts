import { ToneAudioBuffers, Sampler } from 'tone';
import { audioFiles } from './audio/index.js';

const loadBuffers = async (): Promise<ToneAudioBuffers> => {
  return new Promise((resolve) => {
    const buffers = new ToneAudioBuffers(
      audioFiles,
      (onload = function () {
        resolve(buffers);
      })
    );
  });
};

export const createSampler = async (): Promise<Sampler> => {
  const buffers = await loadBuffers();
  return new Promise((resolve) => {
    const sampler = new Sampler({
      urls: {
        G1: buffers.get('G3'),
        A1: buffers.get('A3'),
        C2: buffers.get('C4'),
        'D#2': buffers.get('D#4'),
        'F#2': buffers.get('F#4'),
        A2: buffers.get('A4'),
        C3: buffers.get('C5'),
        'D#3': buffers.get('D#5'),
        'F#3': buffers.get('F#5'),
        A3: buffers.get('A5'),
        C4: buffers.get('C6'),
        'D#4': buffers.get('D#6'),
        'F#4': buffers.get('F#6'),
        A4: buffers.get('A6'),
      },
      onload: () => {
        resolve(sampler);
      },
      release: 2,
    }).toDestination();
  });
};
