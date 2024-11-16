import { Vec2 } from '../vector/vec2';

/**
 * 2x2 矩阵类
 * 矩阵存储格式为列主序:
 * [a b]
 * [c d]
 * 存储在 elements 中的顺序为 [a, b, c, d]
 */
export class Mat2 {
  /** 使用 Float32Array 存储矩阵元素，提高性能 */
  private elements: Float32Array;

  /**
   * 构造函数
   * @param values 可选的初始化值数组
   */
  constructor(values?: number[] | Float32Array) {
    this.elements = new Float32Array(4);

    if (values) {
      this.set(values);
    } else {
      // 默认初始化为零矩阵
      this.elements.fill(0);
    }
  }

  /**
   * 设置矩阵的所有元素
   * @param values 要设置的值数组
   */
  public set(values: number[] | Float32Array): void {
    for (let i = 0; i < 4; i++) {
      this.elements[i] = values[i] || 0;
    }
  }

  /**
   * 获取指定位置的矩阵元素
   * @param row 行索引 (0-1)
   * @param col 列索引 (0-1)
   * @returns 指定位置的值
   */
  public get(row: number, col: number): number {
    return this.elements[row * 2 + col];
  }

  /**
   * 设置指定位置的矩阵元素
   * @param row 行索引 (0-1)
   * @param col 列索引 (0-1)
   * @param value 要设置的值
   */
  public setElement(row: number, col: number, value: number): void {
    this.elements[row * 2 + col] = value;
  }

  /**
   * 矩阵乘法运算
   * 支持：矩阵 x 矩阵，矩阵 x 向量
   * @param other 另一个 2x2 矩阵
   * @param vector 2D 向量
   * @returns 乘法运算结果
   */
  public multiply(other: Mat2): Mat2;
  public multiply(vector: Vec2): Vec2;
  public multiply(value: Mat2 | Vec2): Mat2 | Vec2 {
    if (value instanceof Vec2) {
      // 矩阵与向量相乘
      const result = new Vec2();
      const x = this.elements[0] * value.x + this.elements[1] * value.y;
      const y = this.elements[2] * value.x + this.elements[3] * value.y;
      result.set(x, y);
      return result;
    }

    // 矩阵与矩阵相乘
    const result = new Mat2();
    const a = this.elements;
    const b = value.elements;

    result.elements[0] = a[0] * b[0] + a[1] * b[2]; // 第一列第一个元素
    result.elements[1] = a[0] * b[1] + a[1] * b[3]; // 第二列第一个元素
    result.elements[2] = a[2] * b[0] + a[3] * b[2]; // 第一列第二个元素
    result.elements[3] = a[2] * b[1] + a[3] * b[3]; // 第二列第二个元素

    return result;
  }

  /**
   * 创建单位矩阵
   * [1 0]
   * [0 1]
   */
  public static identity(): Mat2 {
    return new Mat2([1, 0, 0, 1]);
  }

  /**
   * 创建零矩阵
   * [0 0]
   * [0 0]
   */
  public static zero(): Mat2 {
    return new Mat2();
  }

  /**
   * 使用指定值创建矩阵
   * [a b]
   * [c d]
   */
  public static fromValues(a: number, b: number, c: number, d: number): Mat2 {
    return new Mat2([a, b, c, d]);
  }
}
