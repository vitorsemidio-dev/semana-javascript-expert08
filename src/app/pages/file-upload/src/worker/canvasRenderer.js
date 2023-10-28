export default class CanvasRenderer {
  /**
   * @type {HTMLCanvasElement}
   */
  #canvas;

  #ctx;

  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.#canvas = canvas;
    this.#ctx = canvas.getContext('2d');
  }

  /**
   * @param {VideoFrame} frame
   */
  draw(frame) {
    console.log('draw');
    const { displayHeight, displayWidth } = frame;

    this.#canvas.width = displayWidth;
    this.#canvas.height = displayHeight;
    this.#ctx.drawImage(frame, 0, 0, displayWidth, displayHeight);

    frame.close();
  }

  getRenderer() {
    const renderer = this;
    let pendingFrame = null;

    /**
     * @param {VideoFrame} frame
     */
    return (frame) => {
      const rendererAnimation = () => {
        renderer.draw(frame);
        pendingFrame = null;
      };
      if (!pendingFrame) {
        requestAnimationFrame(rendererAnimation);
      } else {
        pendingFrame.close();
      }
      pendingFrame = frame;
    };
  }
}
