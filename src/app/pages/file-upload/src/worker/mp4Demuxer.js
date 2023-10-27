import { createFile } from '../deps/mp4box.0.5.2.js';

export default class MP4Demuxer {
  #onConfig;
  #onChunk;
  #file;

  constructor(params) {}

  /**
   *
   * @param {ReadableStream} stream
   * @param {object} options
   * @param {(config: object) => void} options.onConfig
   */
  async run(stream, { onConfig, onChunk }) {
    this.#onConfig = onConfig;
    this.#onChunk = onChunk;

    this.#file = createFile();

    this.#file.onReach = (args) => {
      console.log(args);
    };

    this.#file.onError = (error) => {
      console.error(error);
    };
  }
}
