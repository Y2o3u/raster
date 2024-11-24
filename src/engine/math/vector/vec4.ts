import { Vec3 } from './vec3';

/**
 * 四维向量类
 * 用于表示4D空间中的点或向量
 */
export default class Vec4 {
  x: number;
  y: number;
  z: number;
  w: number;

  /**
   * 创建一个新的四维向量
   * @param x X 坐标值，默认为 0
   * @param y Y 坐标值，默认为 0
   * @param z Z 坐标值，默认为 0
   * @param w W 坐标值，默认为 0
   */
  constructor(x?: number, y?: number, z?: number, w?: number) {
    this.x = x ?? 0;
    this.y = y ?? 0;
    this.z = z ?? 0;
    this.w = w ?? 0;
  }

  /**
   * 获取三维向量（忽略w分量）
   * @returns 新的三维向量实例
   */
  get xyz() {
    return new Vec3(this.x, this.y, this.z);
  }

  /**
   * 设置向量的 x、y、z、w 分量
   * @param x X 坐标值
   * @param y Y 坐标值
   * @param z Z 坐标值
   * @param w W 坐标值
   */
  set(x: number, y: number, z: number, w: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  /**
   * 向量加法
   * @param vec4 - 要相加的向量
   * @returns 相加后的新向量
   */
  add(vec4: Vec4, out?: Vec4) {
    let newVec4 = out ?? new Vec4();
    newVec4.x = this.x + vec4.x;
    newVec4.y = this.y + vec4.y;
    newVec4.z = this.z + vec4.z;
    newVec4.w = this.w + vec4.w;
    return newVec4;
  }

  /**
   * 向量减法
   * @param vec4 - 要相减的向量
   * @returns 相减后的新向量
   */
  sub(vec4: Vec4) {
    let newVec4 = new Vec4();
    newVec4.x = this.x - vec4.x;
    newVec4.y = this.y - vec4.y;
    newVec4.z = this.z - vec4.z;
    newVec4.w = this.w - vec4.w;
    return newVec4;
  }

  /**
   * 向量乘法
   * @param scale - 缩放因子
   * @param out - 输出向量
   */
  mul(scale: number | Vec4, out?: Vec4) {
    let newVec4 = out ?? new Vec4();
    if (scale instanceof Vec4) {
      newVec4.x = this.x * scale.x;
      newVec4.y = this.y * scale.y;
      newVec4.z = this.z * scale.z;
      newVec4.w = this.w * scale.w;
    } else {
      newVec4.x = this.x * scale;
      newVec4.y = this.y * scale;
      newVec4.z = this.z * scale;
      newVec4.w = this.w * scale;
    }
    return newVec4;
  }

  /**
   * 计算向量的长度
   * @returns 向量的长度
   */
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w + this.w);
  }

  /**
   * 归一化向量
   */
  normalize() {
    let len = this.length();
    this.x /= len;
    this.y /= len;
    this.z /= len;
    this.w /= len;
  }

  /**
   * 标准化向量（忽略w分量）
   */
  standardized() {
    if (this.w === 0) {
      return;
    }
    this.x /= this.w;
    this.y /= this.w;
    this.z /= this.w;
    this.w = 1;
  }

  /**
   * 从另一个向量复制值
   * @param other - 源向量
   */
  fromVec4(other: Vec4): void {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
    this.w = other.w;
  }

  /**
   * 从数组创建向量
   * @param array - 包含x、y、z、w分量的数组
   * @returns 新的Vec4实例
   */
  public static fromArray(array: number[]): Vec4 {
    const len = array.length;
    const out = new Vec4();
    if (len > 0) {
      out.x = array[0];
    }
    if (len > 1) {
      out.y = array[1];
    }
    if (len > 2) {
      out.z = array[2];
    }
    if (len > 3) {
      out.w = array[3];
    }
    return out;
  }

  clone() {
    return new Vec4(this.x, this.y, this.z, this.w);
  }
}
