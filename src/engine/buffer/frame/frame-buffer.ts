import Vec4 from '@/engine/math/vector/vec4';

/** 帧缓冲 */
export interface FrameBuffer {
  /** 帧缓冲数据 */
  frameBuffer: Float32Array;
  /** 清除颜色 */
  clearColor: Vec4;
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
  /** 子像素数量 */
  samples: number;

  /**
   * 设置颜色
   * @param x 像素x坐标
   * @param y 像素y坐标
   * @param color 颜色
   * @param index 子像素索引 (0-n)
   */
  setColor(x: number, y: number, color: Vec4, index?: number): void;

  /**
   * 获取颜色
   * @param x 像素x坐标
   * @param y 像素y坐标
   * @param index 子像素索引 (0-n)
   */
  getColor?(x: number, y: number, index?: number): Vec4;

  /**
   * 设置清除颜色
   * @param color 颜色
   */
  setClearColor(color: Vec4): void;

  /** 清除帧缓冲 */
  clear(): void;

  /** 获取帧缓冲 */
  getFrameBuffer(): Float32Array;
}
