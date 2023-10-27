export default class VideoProcessor {
  #mp4Demuxer;

  /**
   *
   * @param {object} options
   * @param {import('./mp4Demuxer.js').default} options.mp4Demuxer
   */
  constructor({ mp4Demuxer }) {
    this.#mp4Demuxer = mp4Demuxer;
  }

  mp4Decoder(encoderConfig, stream) {
    return new ReadableStream({
      start: async (controller) => {
        const decoder = new VideoDecoder({
          /**
           * @param {VideoFrame} frame
           */
          output(frame) {
            controller.enqueue(frame);
          },
          error(e) {
            console.error('error at mp4Decoder', e);
            controller.error(e);
          },
        });
        this.#mp4Demuxer.run(stream, {
          onConfig: (config) => {
            decoder.configure(config);
          },

          /**
           * @param {EncodedVideoChunk} chunk
           */
          onChunk: (chunk) => {
            decoder.decode(chunk);
          },
        });
      },
    });
  }

  async start({ file, encoderConfig, sendMessage }) {
    const stream = file.stream();
    const filename = getFilename(file.name);
    await this.mp4Decoder(encoderConfig, stream).pipeTo(
      new WritableStream({
        async write(frame) {},
      }),
    );
  }
}

function getFilename(filepath) {
  const filename = filepath
    .split('/')
    .pop()
    .replace(/\.[^/.]+$/, '');
  return filename;
}
