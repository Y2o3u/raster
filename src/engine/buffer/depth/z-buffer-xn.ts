import { ZBuffer } from './z-buffer';

/**
 * 4倍深度缓冲
 * 每个像素存储4个深度值、解决采样区域为2x2时、MSAA黑边问题
 */
export class ZBufferXN implements ZBuffer {
  /** 宽度 */
  protected width: number;
  /** 高度 */
  protected height: number;
  /** 子像素数量 */
  protected samples: number;
  /** 深度缓冲数据 */
  private zBuffer: Float32Array;

  constructor(width: number, height: number, samples: number) {
    this.width = width;
    this.height = height;
    this.samples = samples;
    this.zBuffer = new Float32Array(width * height * samples);
  }

  /** 获取深度缓冲数据 */
  getZBuffer(): Float32Array {
    return this.zBuffer;
  }

  /**
   * 设置深度值
   * @param x x坐标
   * @param y y坐标
   * @param index 子像素索引 (0-3)
   * @param z 深度值
   */
  setZ(x: number, y: number, z: number, index?: number): void {
    const baseIndex = (x + y * this.width) * this.samples;
    this.zBuffer[baseIndex + index] = z;
  }

  /**
   * 获取深度值
   * @param x x坐标
   * @param y y坐标
   * @param index 子像素索引 (0-3)
   */
  getZ(x: number, y: number, index: number): number {
    const baseIndex = (x + y * this.width) * this.samples;
    return this.zBuffer[baseIndex + index];
  }

  /**
   * 深度测试
   * @param x x坐标
   * @param y y坐标
   * @param index 子像素索引 (0-3)
   * @param z 深度值
   */
  zTest(x: number, y: number, z: number, index?: number): boolean {
    if (z > 1 || z < -1) return false;
    const pass = z > this.getZ(x, y, index);
    if (pass) this.setZ(x, y, index, z);
    return pass;
  }

  /** 清除深度缓冲 */
  clear(): void {
    // 超出-1会被剪裁、所以直接设置最小值
    this.zBuffer.fill(-1);
  }
}
