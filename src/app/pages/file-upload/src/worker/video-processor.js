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
        return this.#mp4Demuxer
          .run(stream, {
            onConfig: (config) => {
              decoder.configure(config);
            },

            /**
             * @param {EncodedVideoChunk} chunk
             */
            onChunk: (chunk) => {
              decoder.decode(chunk);
            },
          })
          .then(() => {
            setTimeout(() => {
              controller.close();
            }, 3000);
          });
      },
    });
  }

  enconde144p(encoderConfig) {
    /**
     * @type {VideoEncoder}
     */
    let _encoder;
    const readable = new ReadableStream({
      start: async (controller) => {
        const { supported } = await VideoEncoder.isConfigSupported(
          encoderConfig,
        );
        if (!supported) {
          const message = 'enconde144p VideoEncoder config not supported!';
          console.error(message, encoderConfig);
          controller.error(message);
          return;
        }

        _encoder = new VideoEncoder({
          /**
           *
           * @param {EncodedVideoChunk} frame
           * @param {EncodedVideoChunkMetadata} config
           */
          output: (frame, config) => {
            // debugger;
            if (config.decoderConfig) {
              const decoderConfig = {
                type: 'config',
                config: config.decoderConfig,
              };
              controller.enqueue(decoderConfig);
            }

            controller.enqueue(frame);
          },
          error: (err) => {
            console.error('VideoEncoder 144p', err);
            controller.error(err);
          },
        });

        _encoder.configure(encoderConfig);
      },
    });

    const writable = new WritableStream({
      async write(frame) {
        _encoder.encode(frame);
        frame.close();
      },
    });

    return {
      readable,
      writable,
    };
  }

  async start({ file, encoderConfig, renderFrame, sendMessage }) {
    const stream = file.stream();
    const filename = getFilename(file.name);
    await this.mp4Decoder(encoderConfig, stream)
      .pipeThrough(this.enconde144p(encoderConfig))
      .pipeTo(
        new WritableStream({
          async write(frame) {
            // debugger;
            // renderFrame(frame);
          },
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
