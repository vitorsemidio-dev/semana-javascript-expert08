import WebMWriter from './../deps/webm-writer2.js';
import CanvasRenderer from './canvasRenderer.js';
import MP4Demuxer from './mp4Demuxer.js';
import VideoProcessor from './video-processor.js';

const qvgaConstraints = {
  width: 320,
  height: 240,
};

const vgaConstraints = {
  width: 640,
  height: 480,
};

const hdContains = {
  width: 1280,
  height: 720,
};

const encoderConfig = {
  ...qvgaConstraints,
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

const webmWriterConfig = {
  // ...qvgaConstraints,
  codec: 'VP9',
  width: encoderConfig.width,
  height: encoderConfig.height,
  bitrate: encoderConfig.bitrate,
};

const mp4Demuxer = new MP4Demuxer();
const videoProcessor = new VideoProcessor({
  mp4Demuxer,

  webMWriter: new WebMWriter(webmWriterConfig),
});

onmessage = async ({ data }) => {
  console.log('Iniciando Worker', data);
  const renderFrame = new CanvasRenderer(data.canvas).getRenderer();
  await videoProcessor.start({
    file: data.file,
    encoderConfig,
    renderFrame,
    sendMessage(message) {
      self.postMessage(message);
    },
  });

  self.postMessage({
    status: 'done',
  });

  // troll
  // while (true) {}
};
