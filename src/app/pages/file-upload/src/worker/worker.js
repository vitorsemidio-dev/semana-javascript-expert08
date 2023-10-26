// import VideoProcessor from './video-processor.js';

// const videoProcessor = new VideoProcessor();

const qvgaContaints = {
  width: 320,
  height: 240,
};

const vgaContaints = {
  width: 640,
  height: 480,
};

const hdContains = {
  width: 1280,
  height: 720,
};

const encoderConfig = {
  ...qvgaContaints,
  bitrate: 10e6,
  // ? WebM container format
  codec: 'vp09.00.10.08',
  pt: 4,
  hardwareAcceleration: 'prefer-software',
  // ? MP4
  // codec: 'avc1.42002A',
  // pt: 1,
  // hardwareAcceleration: 'prefer-hardware',
  // avc: { format: 'annexb' },
};

onmessage = async ({ data }) => {
  console.log('Iniciando Worker', data);

  // await videoProcessor.start({
  //   file: data.file,
  //   encoderConfig,
  // });

  self.postMessage({
    status: 'done',
  });

  // troll
  // while (true) {}
};
