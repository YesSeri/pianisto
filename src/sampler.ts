import { ToneAudioBuffers, Sampler } from "tone";
let buffersLoaded = false;
let samplerLoaded = false;
let isLoaded = false;

const loadBuffers = async (): Promise<ToneAudioBuffers> => {
  return new Promise((resolve) => {
    const buffers = new ToneAudioBuffers(
      {
        G3: "./audio/1.g3.ogg",
        A3: "./audio/3.a3.ogg",
        C4: "./audio/6.c4.ogg",
        "D#4": "./audio/9.ds4.ogg",
        "F#4": "./audio/12.fs4.ogg",
        A4: "./audio/15.a4.ogg",
        C5: "./audio/18.c5.ogg",
        "D#5": "./audio/21.ds5.ogg",
        "F#5": "./audio/24.fs5.ogg",
        A5: "./audio/27.a5.ogg",
        C6: "./audio/29.c6.ogg",
        "D#6": "./audio/30.ds6.ogg",
        "F#6": "./audio/31.fs6.ogg",
        A6: "./audio/32.a6.ogg",
      },
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
        G1: buffers.get("G3"),
        A1: buffers.get("A3"),
        C2: buffers.get("C4"),
        "D#2": buffers.get("D#4"),
        "F#2": buffers.get("F#4"),
        A2: buffers.get("A4"),
        C3: buffers.get("C5"),
        "D#3": buffers.get("D#5"),
        "F#3": buffers.get("F#5"),
        A3: buffers.get("A5"),
        C4: buffers.get("C6"),
        "D#4": buffers.get("D#6"),
        "F#4": buffers.get("F#6"),
        A4: buffers.get("A6"),
      },
      onload: () => {
        resolve(sampler);
      },
      release: 2,
    }).toDestination();
  });
};
