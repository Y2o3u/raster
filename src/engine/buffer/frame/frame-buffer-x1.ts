import Vec4 from '@/engine/math/vector/vec4';
import { FrameBuffer } from './frame-buffer';

/** 1倍帧缓冲 */
export class FrameBufferX1 implements FrameBuffer {
  /** 帧缓冲数据 */
  public frameBuffer: Float32Array;
  /** 清除颜色 */
  public clearColor: Vec4 = new Vec4(0, 0, 0, 1);
  /** 宽度 */
  public width: number;
  /** 高度 */
  public height: number;
  /** 子像素数量 */
  public samples: number = 1;

  constructor(width: number, height: number, samples: number = 1) {
    this.width = width;
    this.height = height;
    this.samples = samples;
    this.frameBuffer = new Float32Array(this.width * this.height * 4 * samples);
  }

  /**
   * 设置颜色
   * @param x 像素x坐标
   * @param y 像素y坐标
   * @param color 颜色
   * @param index 子像素索引 (0-1)
   */
  setColor(x: number, y: number, color: Vec4, index: number = 0): void {
    let baseIndex = (x + y * this.width) * 4;
    let offset = baseIndex + index * 4;
    this.frameBuffer[offset] = color.x;
    this.frameBuffer[offset + 1] = color.y;
    this.frameBuffer[offset + 2] = color.z;
    this.frameBuffer[offset + 3] = color.w;
  }

  /**
   * 设置清除颜色
   * @param color 颜色
   */
  setClearColor(color: Vec4): void {
    this.clearColor.fromVec4(color);
  }

  /** 清除帧缓冲 */
  clear(): void {
    let len = this.frameBuffer.length / 4;
    for (let i = 0; i < len; ++i) {
      let idx = 4 * i;
      this.frameBuffer[idx] = this.clearColor.x;
      this.frameBuffer[idx + 1] = this.clearColor.y;
      this.frameBuffer[idx + 2] = this.clearColor.z;
      this.frameBuffer[idx + 3] = this.clearColor.w;
    }
  }

  /** 获取帧缓冲 */
  getFrameBuffer(): Float32Array {
    return this.frameBuffer;
  }
}
