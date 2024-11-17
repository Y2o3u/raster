/** 深度缓冲 */
export interface ZBuffer {
  /**
   * 深度测试
   * @param x
   * @param y
   * @param z
   * @param index
   */
  zTest(x: number, y: number, z: number, index?: any): boolean;

  /**
   * 设置深度信息
   * @param x
   * @param y
   * @param z
   * @param index
   */
  setZ(x: number, y: number, z: number, index?: any): void;

  /**
   * 获取深度值
   * @param x x坐标
   * @param y y坐标
   * @param index 子像素索引 (0-3)
   */
  getZ(x: number, y: number, index: number): number;

  /**
   * 获取深度值
   * @param index 索引
   */
  getZByIndex?(index: number): number;

  /**
   * 获取深度缓冲数据
   */
  getZBuffer(): Float32Array;

  /** 清空所有深度信息 */
  clear(): void;
}
