/**
 * 二维向量类
 * 用于表示2D空间中的点或向量
 */
export class Vec2 {
  /** x 坐标分量 */
  public x: number;
  /** y 坐标分量 */
  public y: number;

  /**
   * 创建一个新的二维向量
   * @param x - x坐标值，默认为0
   * @param y - y坐标值，默认为0
   */
  constructor(x = 0, y = 0) {
    this.set(x, y);
  }

  /**
   * 设置向量的x和y分量
   * @param x - 新的x坐标值
   * @param y - 新的y坐标值
   */
  public set(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  /**
   * 从另一个向量复制值
   * @param other - 要复制的源向量
   */
  public fromVec2(other: Vec2): void {
    this.x = other.x;
    this.y = other.y;
  }

  /**
   * 向量加法
   * @param value - 要加的数值或向量
   * @param out - 可选的输出向量，用于存储结果
   * @returns 相加后的新向量
   */
  public add(value: number, out?: Vec2): Vec2;
  public add(value: Vec2, out?: Vec2): Vec2;
  public add(vec4: Vec2 | number, out?: Vec2): Vec2 {
    if (!out) {
      out = new Vec2();
    }
    if (vec4 instanceof Vec2) {
      out.x = this.x + vec4.x;
      out.y = this.y + vec4.y;
    } else if (typeof vec4 === 'number') {
      out.x = this.x + vec4;
      out.y = this.y + vec4;
    }
    return out;
  }

  /**
   * 向量减法
   * @param value - 要减的数值或向量
   * @param out - 可选的输出向量，用于存储结果
   * @returns 相减后的新向量
   */
  public sub(value: number, out?: Vec2): Vec2;
  public sub(value: Vec2, out?: Vec2): Vec2;
  public sub(vec4: Vec2 | number, out?: Vec2): Vec2 {
    if (!out) {
      out = new Vec2();
    }
    if (vec4 instanceof Vec2) {
      out.x = this.x - vec4.x;
      out.y = this.y - vec4.y;
    } else if (typeof vec4 === 'number') {
      out.x = this.x - vec4;
      out.y = this.y - vec4;
    }
    return out;
  }

  /**
   * 向量乘法
   * @param value - 要乘的数值或向量
   * @param out - 可选的输出向量，用于存储结果
   * @returns 相乘后的新向量
   */
  public mul(value: number, out?: Vec2): Vec2;
  public mul(value: Vec2, out?: Vec2): Vec2;
  public mul(vec4: Vec2 | number, out?: Vec2): Vec2 {
    if (!out) {
      out = new Vec2();
    }
    if (vec4 instanceof Vec2) {
      out.x = this.x * vec4.x;
      out.y = this.y * vec4.y;
    } else if (typeof vec4 === 'number') {
      out.x = this.x * vec4;
      out.y = this.y * vec4;
    }
    return out;
  }

  /**
   * 向量除法
   * @param value - 要除的数值或向量
   * @param out - 可选的输出向量，用于存储结果
   * @returns 相除后的新向量
   */
  public div(value: number, out?: Vec2): Vec2;
  public div(value: Vec2, out?: Vec2): Vec2;
  public div(vec4: Vec2 | number, out?: Vec2): Vec2 {
    if (!out) {
      out = new Vec2();
    }
    if (vec4 instanceof Vec2) {
      out.x = this.x / vec4.x;
      out.y = this.y / vec4.y;
    } else if (typeof vec4 === 'number') {
      out.x = this.x / vec4;
      out.y = this.y / vec4;
    }
    return out;
  }

  /**
   * 缩放向量
   * @param scale - 缩放因子
   */
  public scale(scale: number): void {
    this.x *= scale;
    this.y *= scale;
  }

  /**
   * 标准化向量（使其长度为1）
   * @returns 当前向量实例
   */
  public normalize(): this {
    const len = this.length();
    if (len !== 0) {
      this.x /= len;
      this.y /= len;
    }
    return this;
  }

  /**
   * 获取向量的长度
   * @returns 向量的欧几里得长度
   */
  public length(): number {
    return Math.hypot(this.x, this.y);
  }

  /**
   * 获取向量长度的平方
   * @returns 向量长度的平方
   */
  public lengthSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * 计算到另一个向量的距离
   * @param other - 目标向量
   * @returns 两个向量间的欧几里得距离
   */
  public distanceTo(other: Vec2): number {
    return Math.hypot(this.x - other.x, this.y - other.y);
  }

  /**
   * 检查向量是否为零向量
   * @returns 如果x和y都为0则返回true
   */
  public isZero(): boolean {
    return this.x === 0 && this.y === 0;
  }

  /**
   * 创建当前向量的副本
   * @returns 新的Vec2实例
   */
  public clone(): Vec2 {
    const out = new Vec2();
    out.x = this.x;
    out.y = this.y;
    return out;
  }

  /** 叉乘 */
  public cross(other: Vec2): number {
    return this.x * other.y - this.y * other.x;
  }

  /**
   * 创建当前向量的反向向量
   * @returns 新的反向Vec2实例
   */
  public reverse(): Vec2 {
    return new Vec2(-this.x, -this.y);
  }

  /**
   * 将向量转换为字符串表示
   * @returns 格式化的字符串表示
   */
  public toString(): string {
    return `vec2(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
  }

  /**
   * 从数组创建向量
   * @param array - 包含x和y分量的数组
   * @returns 新的Vec2实例
   */
  public static fromArray(array: number[]): Vec2 {
    const len = array.length;
    const out = new Vec2();
    if (len > 0) {
      out.x = array[0];
    }
    if (len > 1) {
      out.y = array[1];
    }
    return out;
  }

  /**
   * 创建零向量 (0, 0)
   * @returns 新的零向量实例
   */
  public static zero(): Vec2 {
    return new Vec2(0, 0);
  }

  /**
   * 创建单位向量 (1, 1)
   * @returns 新的单位向量实例
   */
  public static one(): Vec2 {
    return new Vec2(1, 1);
  }

  /**
   * 创建向上的单位向量 (0, 1)
   * @returns 新的向上单位向量实例
   */
  public static up(): Vec2 {
    return new Vec2(0, 1);
  }

  /**
   * 创建向下的单位向量 (0, -1)
   * @returns 新的向下单位向量实例
   */
  public static down(): Vec2 {
    return new Vec2(0, -1);
  }

  /**
   * 创建向左的单位向量 (-1, 0)
   * @returns 新的向左单位向量实例
   */
  public static left(): Vec2 {
    return new Vec2(-1, 0);
  }

  /**
   * 创建向右的单位向量 (1, 0)
   * @returns 新的向右单位向量实例
   */
  public static right(): Vec2 {
    return new Vec2(1, 0);
  }
}
