/**
 * 顶点数组对象
 * 包含顶点数据和三角形索引数据
 */
export class VAO {
  // 局部坐标信息
  position: number[];
  // 纹理坐标信息
  uv: number[];
  // 颜色信息
  color: number[];
  // 法线信息
  normal: number[];
  // 切线信息
  tangent: number[];
  // 三角形索引信息
  indices: number[];

  // 构造函数，用于初始化 VAO 对象
  constructor(positionSize: number, uvSize: number, colorSize: number, normalSize: number, tangentSize: number) {
    this.position = new Array(positionSize);
    this.uv = new Array(uvSize);
    this.color = new Array(colorSize);
    this.normal = new Array(normalSize);
    this.tangent = new Array(tangentSize);
  }
}
