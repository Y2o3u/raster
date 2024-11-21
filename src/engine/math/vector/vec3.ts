/**
 * 三维向量类
 * 用于表示3D空间中的点或向量
 */
export class Vec3 {
  x: number;
  y: number;
  z: number;

  /**
   * 创建一个新的三维向量
   * @param x X 坐标值，默认为 0
   * @param y Y 坐标值，默认为 0
   * @param z Z 坐标值，默认为 0
   */
  constructor(x?: number, y?: number, z?: number) {
    this.x = x ?? 0;
    this.y = y ?? 0;
    this.z = z ?? 0;
  }

  /**
   * 设置向量的 x、y、z 分量
   * @param x X 坐标值
   * @param y Y 坐标值
   * @param z Z 坐标值
   */
  set(x: number, y: number, z: number): void {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * 从另一个向量复制值
   * @param other 源向量
   */
  fromVec3(other: Vec3): void {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
  }

  /**
   * 向量加法运算
   * @param value 要加的数值或向量
   * @param out 输出结果的向量，如果不提供则创建新向量
   * @returns 运算结果向量
   */
  add(value: number, out?: Vec3): Vec3;
  add(value: Vec3, out?: Vec3): Vec3;
  add(value: Vec3 | number, out?: Vec3): Vec3 {
    if (!out) out = new Vec3();
    if (value instanceof Vec3) {
      out.x = this.x + value.x;
      out.y = this.y + value.y;
      out.z = this.z + value.z;
    } else if (typeof value === 'number') {
      out.x = this.x + value;
      out.y = this.y + value;
      out.z = this.z + value;
    }
    return out;
  }

  /**
   * 向量减法运算
   * @param value 要减的数值或向量
   * @param out 输出结果的向量，如果不提供则创建新向量
   * @returns 运算结果向量
   */
  sub(value: number, out?: Vec3): Vec3;
  sub(value: Vec3, out?: Vec3): Vec3;
  sub(value: Vec3 | number, out?: Vec3): Vec3 {
    if (!out) out = new Vec3();
    if (value instanceof Vec3) {
      out.x = this.x - value.x;
      out.y = this.y - value.y;
      out.z = this.z - value.z;
    } else if (typeof value === 'number') {
      out.x = this.x - value;
      out.y = this.y - value;
      out.z = this.z - value;
    }
    return out;
  }

  /**
   * 向量乘法运算
   * @param value 要乘的数值或向量
   * @param out 输出结果的向量，如果不提供则创建新向量
   * @returns 运算结果向量
   */
  mul(value: number, out?: Vec3): Vec3;
  mul(value: Vec3, out?: Vec3): Vec3;
  mul(value: Vec3 | number, out?: Vec3): Vec3 {
    if (!out) out = new Vec3();
    if (value instanceof Vec3) {
      out.x = this.x * value.x;
      out.y = this.y * value.y;
      out.z = this.z * value.z;
    } else if (typeof value === 'number') {
      out.x = this.x * value;
      out.y = this.y * value;
      out.z = this.z * value;
    }
    return out;
  }

  /**
   * 向量除法运算
   * @param value 要除的数值或向量
   * @param out 输出结果的向量，如果不提供则创建新向量
   * @returns 运算结果向量
   */
  div(value: number, out?: Vec3): Vec3;
  div(value: Vec3, out?: Vec3): Vec3;
  div(value: Vec3 | number, out?: Vec3): Vec3 {
    if (!out) out = new Vec3();
    if (value instanceof Vec3) {
      out.x = this.x / value.x;
      out.y = this.y / value.y;
      out.z = this.z / value.z;
    } else if (typeof value === 'number') {
      out.x = this.x / value;
      out.y = this.y / value;
      out.z = this.z / value;
    }
    return out;
  }

  /**
   * 缩放向量
   * @param scale 缩放因子
   */
  scale(scale: number): void {
    this.x *= scale;
    this.y *= scale;
    this.z *= scale;
  }

  /**
   * 绕 X 轴旋转
   * @param rad 旋转角度（度）
   */
  rotateX(rad: number): void {
    rad *= Math.PI / 180;
    const y = this.y * Math.cos(rad) - this.z * Math.sin(rad);
    const z = this.y * Math.sin(rad) + this.z * Math.cos(rad);
    this.y = y;
    this.z = z;
  }

  /**
   * 绕 Y 轴旋转
   * @param rad 旋转角度（度）
   */
  rotateY(rad: number): void {
    rad *= Math.PI / 180;
    const x = this.z * Math.sin(rad) + this.x * Math.cos(rad);
    const z = this.z * Math.cos(rad) - this.x * Math.sin(rad);
    this.x = x;
    this.z = z;
  }

  /**
   * 绕 Z 轴旋转
   * @param rad 旋转角度（度）
   */
  rotateZ(rad: number): void {
    rad *= Math.PI / 180;
    const x = this.x * Math.cos(rad) - this.y * Math.sin(rad);
    const y = this.x * Math.sin(rad) + this.y * Math.cos(rad);
    this.x = x;
    this.y = y;
  }

  /**
   * 计算与另一个向量的点积
   * @param v 另一个向量
   * @returns 点积结果
   */
  dot(v: Vec3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  /**
   * 获取向量的长度
   * @returns 向量长度
   */
  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  /**
   * 获取向量长度的平方
   * @returns 向量长度的平方
   */
  lengthSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  /**
   * 计算与另一个向量的距离
   * @param v 另一个向量
   * @returns 两个向量间的距离
   */
  distance(v: Vec3): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * 标准化向量（使向量长度为1）
   * @returns this 引用
   */
  normalize(): this {
    const len = this.length();
    if (len !== 0) {
      const invLen = 1 / len;
      this.x *= invLen;
      this.y *= invLen;
      this.z *= invLen;
    }
    return this;
  }

  /**
   * 叉乘
   * @param other 另一个向量
   * @returns 叉乘结果
   */
  cross(other: Vec3): Vec3 {
    return new Vec3(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x
    );
  }

  /**
   * 检查两个向量是否相等
   * @param v 另一个向量
   * @returns 是否相等
   */
  equals(v: Vec3): boolean {
    return this.x === v.x && this.y === v.y && this.z === v.z;
  }

  /**
   * 检查向量是否为零向量
   * @returns 是否为零向量
   */
  isZero(): boolean {
    return this.x === 0 && this.y === 0 && this.z === 0;
  }

  /**
   * 克隆向量
   * @returns 新的向量实例
   */
  clone(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  }

  /**
   * 获取向量的反向量
   * @returns 新的反向量
   */
  reverse(): Vec3 {
    return new Vec3(-this.x, -this.y, -this.z);
  }

  /**
   * 将向量转换为字符串表示
   * @returns 向量的字符串表示
   */
  toString(): string {
    return `vec3(${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)})`;
  }

  /**
   * 计算两个向量的叉积
   * @param a 第一个向量
   * @param b 第二个向量
   * @param out 输出结果的向量，如果不提供则创建新向量
   * @returns 叉积结果向量
   */
  static cross(a: Vec3, b: Vec3, out?: Vec3): Vec3 {
    if (!out) out = new Vec3();
    out.set(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
    return out;
  }

  /**
   * 从数组创建向量
   * @param array 包含向量分量的数组
   * @returns 新的向量实例
   */
  static fromArray(array: number[]): Vec3 {
    return new Vec3(array.length > 0 ? array[0] : 0, array.length > 1 ? array[1] : 0, array.length > 2 ? array[2] : 0);
  }

  /**
   * 创建零向量
   * @returns 新的零向量
   */
  static zero(): Vec3 {
    return new Vec3(0, 0, 0);
  }

  /**
   * 创建单位向量
   * @returns 新的单位向量
   */
  static one(): Vec3 {
    return new Vec3(1, 1, 1);
  }

  /**
   * 创建向上的单位向量
   * @returns 新的向上向量
   */
  static up(): Vec3 {
    return new Vec3(0, 1, 0);
  }

  /**
   * 创建向下的单位向量
   * @returns 新的向下向量
   */
  static down(): Vec3 {
    return new Vec3(0, -1, 0);
  }

  /**
   * 创建向前的单位向量
   * @returns 新的向前向量
   */
  static forward(): Vec3 {
    return new Vec3(0, 0, 1);
  }

  /**
   * 创建向后的单位向量
   * @returns 新的向后向量
   */
  static back(): Vec3 {
    return new Vec3(0, 0, -1);
  }

  /**
   * 创建向右的单位向量
   * @returns 新的向右向量
   */
  static right(): Vec3 {
    return new Vec3(1, 0, 0);
  }

  /**
   * 创建向左的单位向量
   * @returns 新的向左向量
   */
  static left(): Vec3 {
    return new Vec3(-1, 0, 0);
  }

  /**
   * 计算两点之间的距离
   * @param a 第一个点
   * @param b 第二个点
   * @returns 两点之间的距离
   */
  static distance(a: Vec3, b: Vec3): number {
    return a.distance(b);
  }

  /**
   * 在两个向量之间进行线性插值
   * @param a 起始向量
   * @param b 目标向量
   * @param t 插值参数 (0-1)
   * @param out 输出结果的向量，如果不提供则创建新向量
   * @returns 插值结果向量
   */
  static lerp(a: Vec3, b: Vec3, t: number, out?: Vec3): Vec3 {
    if (!out) out = new Vec3();
    out.x = a.x + (b.x - a.x) * t;
    out.y = a.y + (b.y - a.y) * t;
    out.z = a.z + (b.z - a.z) * t;
    return out;
  }
}
