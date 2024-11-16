import Vec4 from '../vector/vec4';

/**
 * 4x4 矩阵类
 * 矩阵存储格式为列主序:
 * [a b c d]
 * [e f g h]
 * [i j k l]
 * [m n o p]
 */
export class Mat4 {
  private elements: Float32Array;
  private static readonly SIZE = 16;

  /**
   * 构造函数
   * @param values 可选的初始化值数组
   */
  constructor(values?: number[] | Float32Array) {
    this.elements = new Float32Array(Mat4.SIZE);

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
    for (let i = 0; i < Mat4.SIZE; i++) {
      this.elements[i] = values[i] || 0;
    }
  }

  /**
   * 获取指定位置的矩阵元素
   * @param row 行索引 (0-3)
   * @param col 列索引 (0-3)
   * @returns 指定位置的值
   */
  public get(row: number, col: number): number {
    return this.elements[row * 4 + col];
  }

  /**
   * 设置指定位置的矩阵元素
   * @param row 行索引 (0-3)
   * @param col 列索引 (0-3)
   * @param value 要设置的值
   */
  public setElement(row: number, col: number, value: number): void {
    this.elements[row * 4 + col] = value;
  }

  /**
   * 矩阵转置
   */
  public transpose(): void {
    const temp = [
      this.elements[1],
      this.elements[2],
      this.elements[3],
      this.elements[6],
      this.elements[7],
      this.elements[11],
    ];

    this.elements[1] = this.elements[4];
    this.elements[2] = this.elements[8];
    this.elements[3] = this.elements[12];
    this.elements[6] = this.elements[9];
    this.elements[7] = this.elements[13];
    this.elements[11] = this.elements[14];

    this.elements[4] = temp[0];
    this.elements[8] = temp[1];
    this.elements[12] = temp[2];
    this.elements[9] = temp[3];
    this.elements[13] = temp[4];
    this.elements[14] = temp[5];
  }

  /**
   * 克隆矩阵
   * @returns 新的矩阵实例
   */
  public clone(): Mat4 {
    return new Mat4(Array.from(this.elements));
  }

  /**
   * 将矩阵转换为字符串
   * @returns 矩阵的字符串表示
   */
  public toString(): string {
    const f = (n: number) => n.toFixed(2);
    const e = this.elements;
    return (
      `Mat4(\n\t${f(e[0])}, ${f(e[1])}, ${f(e[2])}, ${f(e[3])},\n\t` +
      `${f(e[4])}, ${f(e[5])}, ${f(e[6])}, ${f(e[7])},\n\t` +
      `${f(e[8])}, ${f(e[9])}, ${f(e[10])}, ${f(e[11])},\n\t` +
      `${f(e[12])}, ${f(e[13])}, ${f(e[14])}, ${f(e[15])})`
    );
  }

  /**
   * 矩阵乘法运算
   * 支持：矩阵 x 矩阵，矩阵 x 向量
   * @param other 另一个 4x4 矩阵
   * @param vector 4D 向量
   * @returns 乘法运算结果
   */
  public multiply(other: Mat4): Mat4;
  public multiply(vector: Vec4): Vec4;
  public multiply(value: Mat4 | Vec4): Mat4 | Vec4 {
    if (value instanceof Vec4) {
      const result = new Vec4();
      const e = this.elements;
      const x = e[0] * value.x + e[1] * value.y + e[2] * value.z + e[3] * value.w;
      const y = e[4] * value.x + e[5] * value.y + e[6] * value.z + e[7] * value.w;
      const z = e[8] * value.x + e[9] * value.y + e[10] * value.z + e[11] * value.w;
      const w = e[12] * value.x + e[13] * value.y + e[14] * value.z + e[15] * value.w;
      result.set(x, y, z, w);
      return result;
    }

    const result = new Mat4();
    const a = this.elements;
    const b = value.elements;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += a[i * 4 + k] * b[k * 4 + j];
        }
        result.elements[i * 4 + j] = sum;
      }
    }

    return result;
  }

  /**
   * 将角度转换为弧度
   * @param angle 角度值
   * @returns 弧度值
   */
  private static toRadian(angle: number): number {
    return (Math.PI / 180) * angle;
  }

  /**
   * 创建单位矩阵
   * @returns 新的矩阵实例
   */
  public static identity(): Mat4 {
    return new Mat4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }

  /**
   * 创建零矩阵
   * @returns 新的矩阵实例
   */
  public static zero(): Mat4 {
    return new Mat4();
  }

  /**
   * 创建平移矩阵
   * @param x 平移量 x
   * @param y 平移量 y
   * @param z 平移量 z
   * @returns 新的矩阵实例
   */
  public static translation(x: number, y: number, z: number): Mat4 {
    const mat = Mat4.identity();
    mat.setElement(0, 3, x);
    mat.setElement(1, 3, y);
    mat.setElement(2, 3, z);
    return mat;
  }

  /**
   * 创建绕 X 轴旋转的矩阵
   * @param angle 旋转角度
   * @returns 新的矩阵实例
   */
  public static rotationX(angle: number): Mat4 {
    const rad = Mat4.toRadian(angle);
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);

    return new Mat4([1, 0, 0, 0, 0, cos, -sin, 0, 0, sin, cos, 0, 0, 0, 0, 1]);
  }

  /**
   * 创建绕 Y 轴旋转的矩阵
   * @param angle 旋转角度
   * @returns 新的矩阵实例
   */
  public static rotationY(angle: number): Mat4 {
    const rad = Mat4.toRadian(angle);
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);

    return new Mat4([cos, 0, sin, 0, 0, 1, 0, 0, -sin, 0, cos, 0, 0, 0, 0, 1]);
  }

  /**
   * 创建绕 Z 轴旋转的矩阵
   * @param angle 旋转角度
   * @returns 新的矩阵实例
   */
  public static rotationZ(angle: number): Mat4 {
    const rad = Mat4.toRadian(angle);
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);

    return new Mat4([cos, -sin, 0, 0, sin, cos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }

  /**
   * 创建缩放矩阵
   * @param x 缩放量 x
   * @param y 缩放量 y
   * @param z 缩放量 z
   * @returns 新的矩阵实例
   */
  public static scaling(x: number, y: number, z: number): Mat4 {
    return new Mat4([x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1]);
  }

  /**
   * 从数值数组创建矩阵
   * @returns 新的矩阵实例
   */
  public static fromValues(
    m11: number,
    m12: number,
    m13: number,
    m14: number,
    m21: number,
    m22: number,
    m23: number,
    m24: number,
    m31: number,
    m32: number,
    m33: number,
    m34: number,
    m41: number,
    m42: number,
    m43: number,
    m44: number
  ): Mat4 {
    return new Mat4([m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44]);
  }

  /**
   * 矩阵求逆
   */
  public invert(): Mat4 {
    const m = this.elements;
    const inv = new Float32Array(16);

    inv[0] =
      m[5] * m[10] * m[15] -
      m[5] * m[11] * m[14] -
      m[9] * m[6] * m[15] +
      m[9] * m[7] * m[14] +
      m[13] * m[6] * m[11] -
      m[13] * m[7] * m[10];

    inv[4] =
      -m[4] * m[10] * m[15] +
      m[4] * m[11] * m[14] +
      m[8] * m[6] * m[15] -
      m[8] * m[7] * m[14] -
      m[12] * m[6] * m[11] +
      m[12] * m[7] * m[10];

    inv[8] =
      m[4] * m[9] * m[15] -
      m[4] * m[11] * m[13] -
      m[8] * m[5] * m[15] +
      m[8] * m[7] * m[13] +
      m[12] * m[5] * m[11] -
      m[12] * m[7] * m[9];

    inv[12] =
      -m[4] * m[9] * m[14] +
      m[4] * m[10] * m[13] +
      m[8] * m[5] * m[14] -
      m[8] * m[6] * m[13] -
      m[12] * m[5] * m[10] +
      m[12] * m[6] * m[9];

    inv[1] =
      -m[1] * m[10] * m[15] +
      m[1] * m[11] * m[14] +
      m[9] * m[2] * m[15] -
      m[9] * m[3] * m[14] -
      m[13] * m[2] * m[11] +
      m[13] * m[3] * m[10];

    inv[5] =
      m[0] * m[10] * m[15] -
      m[0] * m[11] * m[14] -
      m[8] * m[2] * m[15] +
      m[8] * m[3] * m[14] +
      m[12] * m[2] * m[11] -
      m[12] * m[3] * m[10];

    inv[9] =
      -m[0] * m[9] * m[15] +
      m[0] * m[11] * m[13] +
      m[8] * m[1] * m[15] -
      m[8] * m[3] * m[13] -
      m[12] * m[1] * m[11] +
      m[12] * m[3] * m[9];

    inv[13] =
      m[0] * m[9] * m[14] -
      m[0] * m[10] * m[13] -
      m[8] * m[1] * m[14] +
      m[8] * m[2] * m[13] +
      m[12] * m[1] * m[10] -
      m[12] * m[2] * m[9];

    inv[2] =
      m[1] * m[6] * m[15] -
      m[1] * m[7] * m[14] -
      m[5] * m[2] * m[15] +
      m[5] * m[3] * m[14] +
      m[13] * m[2] * m[7] -
      m[13] * m[3] * m[6];

    inv[6] =
      -m[0] * m[6] * m[15] +
      m[0] * m[7] * m[14] +
      m[4] * m[2] * m[15] -
      m[4] * m[3] * m[14] -
      m[12] * m[2] * m[7] +
      m[12] * m[3] * m[6];

    inv[10] =
      m[0] * m[5] * m[15] -
      m[0] * m[7] * m[13] -
      m[4] * m[1] * m[15] +
      m[4] * m[3] * m[13] +
      m[12] * m[1] * m[7] -
      m[12] * m[3] * m[5];

    inv[14] =
      -m[0] * m[5] * m[14] +
      m[0] * m[6] * m[13] +
      m[4] * m[1] * m[14] -
      m[4] * m[2] * m[13] -
      m[12] * m[1] * m[6] +
      m[12] * m[2] * m[5];

    inv[3] =
      -m[1] * m[6] * m[11] +
      m[1] * m[7] * m[10] +
      m[5] * m[2] * m[11] -
      m[5] * m[3] * m[10] -
      m[9] * m[2] * m[7] +
      m[9] * m[3] * m[6];

    inv[7] =
      m[0] * m[6] * m[11] -
      m[0] * m[7] * m[10] -
      m[4] * m[2] * m[11] +
      m[4] * m[3] * m[10] +
      m[8] * m[2] * m[7] -
      m[8] * m[3] * m[6];

    inv[11] =
      -m[0] * m[5] * m[11] +
      m[0] * m[7] * m[9] +
      m[4] * m[1] * m[11] -
      m[4] * m[3] * m[9] -
      m[8] * m[1] * m[7] +
      m[8] * m[3] * m[5];

    inv[15] =
      m[0] * m[5] * m[10] -
      m[0] * m[6] * m[9] -
      m[4] * m[1] * m[10] +
      m[4] * m[2] * m[9] +
      m[8] * m[1] * m[6] -
      m[8] * m[2] * m[5];

    let det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];

    if (det === 0) {
      throw new Error('矩阵不可逆');
    }

    det = 1.0 / det;

    for (let i = 0; i < 16; i++) {
      inv[i] *= det;
    }

    return new Mat4(inv);
  }
}
