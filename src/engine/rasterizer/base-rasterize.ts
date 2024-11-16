import { FragmentShader } from '../shader/fragment/fragment-shader';
import { Vertex } from '../core/data/vertex';
import Vec4 from '../math/vector/vec4';
import { FrameBuffer } from '../buffer/frame/frame-buffer';
import { ZBuffer } from '../buffer/depth/z-buffer';
import { RenderContext } from '../core/render-context';

export class Rasterizer {
  /** 宽度 */
  protected width: number = 0;
  /** 高度 */
  protected height: number = 0;

  /** z缓冲 */
  public zBuffer: ZBuffer;
  /** 帧缓冲 */
  public frameBuffer: FrameBuffer;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.frameBuffer = new FrameBuffer(width, height);
    this.zBuffer = new ZBuffer(width, height);
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

  clear(): void {
    this.frameBuffer.clear();
    this.zBuffer.clear();
  }
}
