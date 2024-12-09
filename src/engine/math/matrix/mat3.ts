import { Vec3 } from '../vector/vec3';

/**
 * 3x3 矩阵类
 * 矩阵存储格式为列主序:
 * [a b c]
 * [d e f]
 * [g h i]
 */
export class Mat3 {
  private elements: Float32Array;

  /**
   * 构造函数
   * @param values 可选的初始化值数组
   */
  constructor(values?: number[] | Float32Array) {
    this.elements = new Float32Array(9);

    if (values) {
      this.set(values);
    } else {
      this.elements.fill(0);
    }
  }

  /**
   * 设置矩阵的所有元素
   * @param values 要设置的值数组
   */
  public set(values: number[] | Float32Array): void {
    for (let i = 0; i < 9; i++) {
      this.elements[i] = values[i] || 0;
    }
  }

  /**
   * 获取指定位置的矩阵元素
   * @param row 行索引 (0-2)
   * @param col 列索引 (0-2)
   * @returns 指定位置的值
   */
  public get(row: number, col: number): number {
    return this.elements[row * 3 + col];
  }

  /**
   * 设置指定位置的矩阵元素
   * @param row 行索引 (0-2)
   * @param col 列索引 (0-2)
   * @param value 要设置的值
   */
  public setElement(row: number, col: number, value: number): void {
    this.elements[row * 3 + col] = value;
  }

  /**
   * 矩阵转置
   */
  public transpose(): Mat3 {
    const temp = [this.elements[1], this.elements[2], this.elements[5]];

    this.elements[1] = this.elements[3];
    this.elements[2] = this.elements[6];
    this.elements[5] = this.elements[7];

    this.elements[3] = temp[0];
    this.elements[6] = temp[1];
    this.elements[7] = temp[2];

    return this;
  }

  /**
   * 克隆矩阵
   * @returns 新的矩阵实例
   */
  public clone(): Mat3 {
    return new Mat3(this.elements);
  }

  /**
   * 将矩阵转换为字符串
   * @returns 矩阵的字符串表示
   */
  public toString(): string {
    const f = (n: number) => n.toFixed(2);
    const e = this.elements;
    return `Mat3(\n\t${f(e[0])}, ${f(e[1])}, ${f(e[2])},\n\t${f(e[3])}, ${f(e[4])}, ${f(e[5])},\n\t${f(e[6])}, ${f(
      e[7]
    )}, ${f(e[8])})`;
  }

  /**
   * 矩阵乘法运算
   * 支持：矩阵 x 矩阵，矩阵 x 向量
   * @param other 另一个 3x3 矩阵
   * @param vector 3D 向量
   * @returns 乘法运算结果
   */
  public mul(other: Mat3): Mat3;
  public mul(vector: Vec3): Vec3;
  public mul(value: Mat3 | Vec3): Mat3 | Vec3 {
    if (value instanceof Vec3) {
      const result = new Vec3();
      const e = this.elements;
      const x = e[0] * value.x + e[1] * value.y + e[2] * value.z;
      const y = e[3] * value.x + e[4] * value.y + e[5] * value.z;
      const z = e[6] * value.x + e[7] * value.y + e[8] * value.z;
      result.set(x, y, z);
      return result;
    }

    const result = new Mat3();
    const a = this.elements;
    const b = value.elements;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let sum = 0;
        for (let k = 0; k < 3; k++) {
          sum += a[i * 3 + k] * b[k * 3 + j];
        }
        result.elements[i * 3 + j] = sum;
      }
    }

    return result;
  }

  /**
   * 创建单位矩阵
   * @returns 新的矩阵实例
   */
  public static identity(): Mat3 {
    return new Mat3([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  }

  /**
   * 创建零矩阵
   * @returns 新的矩阵实例
   */
  public static zero(): Mat3 {
    return new Mat3();
  }

  /**
   * 从数值数组创建矩阵
   * @returns 新的矩阵实例
   */
  public static fromValues(
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
    g: number,
    h: number,
    i: number
  ): Mat3 {
    return new Mat3([a, b, c, d, e, f, g, h, i]);
  }

  /**
   * 从列向量创建矩阵
   * @returns 新的矩阵实例
   */
  public static fromColumns(a: Vec3, b: Vec3, c: Vec3): Mat3 {
    return new Mat3([a.x, b.x, c.x, a.y, b.y, c.y, a.z, b.z, c.z]);
  }
}
