import { FragmentShader } from '../shader/fragment/fragment-shader';
import { Vertex } from '../core/data/vertex';
import Vec4 from '../math/vector/vec4';
import { FrameBuffer } from '../buffer/frame/frame-buffer';
import { ZBuffer } from '../buffer/depth/z-buffer';
import { RenderContext } from '../core/render-context';
import { ZBufferX1 } from '../buffer/depth/z-buffer-x1';
import { ZBufferXN } from '../buffer/depth/z-buffer-xn';
import { FrameBufferXN } from '../buffer/frame/frame-buffer-xn';
import { FrameBufferX1 } from '../buffer/frame/frame-buffer-x1';

export class Rasterizer {
  /** 宽度 */
  protected width: number = 0;
  /** 高度 */
  protected height: number = 0;

  /** 深度缓冲 */
  public zBuffer: ZBuffer;
  /** 帧缓冲 */
  public frameBuffer: FrameBuffer;

  /** 超采样缓冲 */
  public superSampleBuffer: FrameBuffer;
  /** 超采样深度缓冲 */
  public superSampleZBuffer: ZBuffer;

  /** 是否开启MSAA抗锯齿 */
  protected isEnableMSAA: boolean = false;
  /** 子像素数量 */
  protected samples: number = 4;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.frameBuffer = new FrameBufferX1(width, height);
    this.zBuffer = new ZBufferX1(width, height);
  }

  /** 设置是否开启MSAA抗锯齿 */
  setEnableMSAA(enable: boolean): void {
    this.isEnableMSAA = enable;

    // 开启MSAA抗锯齿
    if (this.isEnableMSAA) {
      this.superSampleBuffer = new FrameBufferXN(this.width, this.height, this.samples);
      this.superSampleZBuffer = new ZBufferXN(this.width, this.height, this.samples);
    }
  }

  /**
   * 渲染
   * @param p0 三角形顶点0
   * @param p1 三角形顶点1
   * @param p2 三角形顶点2
   * @param v0 三角形顶点0的顶点数据
   * @param v1 三角形顶点1的顶点数据
   * @param v2 三角形顶点2的顶点数据
   * @param fs 片元着色器
   * @param renderContext 渲染上下文
   */
  run(p0: Vec4, p1: Vec4, p2: Vec4, v0: Vertex, v1: Vertex, v2: Vertex, renderContext: RenderContext): void {}

  /** 获取帧缓冲 */
  getFrameBuffer(): Float32Array {
    return this.frameBuffer.getFrameBuffer();
  }

  clear(): void {
    this.frameBuffer.clear();
    this.zBuffer.clear();
  }
}
