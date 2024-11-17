export class WebCanvas {
  /** 绘制上下文 */
  private readonly ctx: CanvasRenderingContext2D;

  /** 渲染数据 */
  private readonly imgData: ImageData;

  /** 屏幕宽高 */
  width = 0;
  height = 0;

  /**
   * 构造函数
   * @param canvasId - canvas元素ID
   */
  constructor(canvasId: string) {
    if (!window.document) return;
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas 元素未找到');
      return;
    }
    // 获取绘制上下文
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    // 获取屏幕宽高
    this.width = canvas.width;
    this.height = canvas.height;
    // 获取渲染数据
    this.imgData = this.ctx.getImageData(0, 0, this.width, this.height);
  }

  /**
   * 渲染
   * @param frameBuffer - 帧缓冲
   */
  render(frameBuffer: Float32Array) {
    if (frameBuffer.length !== this.imgData.data.length) {
      console.error('场景尺寸不一致');
      return;
    }
    const data = new Uint8ClampedArray(frameBuffer.map((value) => value * 255));
    this.imgData.data.set(data);
    this.ctx.putImageData(this.imgData, 0, 0);
  }
}
