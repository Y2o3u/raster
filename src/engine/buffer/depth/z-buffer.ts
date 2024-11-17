/** 深度缓冲 */
export class ZBuffer {
  protected width: number;
  protected height: number;

  /** 深度缓冲数据 */
  private zBuffer: Float32Array;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.zBuffer = new Float32Array(width * height);
  }

  /**
   * 设置深度值
   * @param x 像素x坐标
   * @param y 像素y坐标
   * @param z 深度值
   */
  setZ(x: number, y: number, z: number): void {
    this.zBuffer[x + y * this.width] = z;
  }

  /**
   * 获取深度值
   * @param x 像素x坐标
   * @param y 像素y坐标
   */
  getZ(x: number, y: number): number {
    return this.zBuffer[x + y * this.width];
  }

  /**
   * 深度测试、通过自动写入深度
   * @param x 像素x坐标
   * @param y 像素y坐标
   * @param z 深度值
   */
  zTest(x: number, y: number, z: number): boolean {
    // 透视除法后、深度值范围在[-1, 1]之间
    if (z > 1 || z < -1) return false;
    const pass = z > this.getZ(x, y);
    if (pass) this.setZ(x, y, z);
    return pass;
  }

  /** 清除深度缓冲 */
  clear(): void {
    this.zBuffer.fill(-1);
  }
}
