import { VAO } from './vao';

/** 顶点缓冲对象 */
export class VBO {
  // 存储顶点数据的数组
  private vertexData: Float32Array = new Float32Array();
  // 各种顶点属性的默认大小
  private positionSize: number = 3;
  private uvSize: number = 2;
  private colorSize: number = 3;
  private normalSize: number = 3;
  private tangentSize: number = 4;

  /** 顶点大小 */
  private vertexSize: number = 14;

  /** 顶点数量 */
  private totalVertices = 0;

  constructor(positionSize = 3, uvSize = 2, colorSize = 3, normalSize = 4, tangentSize = 4) {
    this.setAttributeSizes(positionSize, uvSize, colorSize, normalSize, tangentSize);
  }

  /** 设置顶点属性的大小 */
  setAttributeSizes(positionSize = 3, uvSize = 2, colorSize = 3, normalSize = 4, tangentSize = 4) {
    this.positionSize = positionSize;
    this.uvSize = uvSize;
    this.colorSize = colorSize;
    this.normalSize = normalSize;
    this.tangentSize = tangentSize;
    this.vertexSize = positionSize + uvSize + colorSize + normalSize + tangentSize;
  }

  /** 设置顶点数量 */
  setVertexCount(count: number) {
    this.totalVertices = count;
  }

  /** 获取顶点数量 */
  getVertexCount() {
    return this.totalVertices;
  }

  /** 设置顶点数据 */
  setVertexData(data: number[]) {
    this.vertexData = new Float32Array(data);
  }

  /** 获取顶点数据 */
  getVertexData() {
    return Array.from(this.vertexData);
  }

  /** 清空顶点数据 */
  clearVertexData() {
    this.vertexData = new Float32Array();
  }

  /** 获取某一个顶点的数据 */
  getVertexVAO(index: number, vao?: VAO): VAO {
    if (!vao) vao = new VAO(this.positionSize, this.uvSize, this.colorSize, this.normalSize, this.tangentSize);
    // 获取顶点属性
    const attributes = [
      { array: vao.position, size: this.positionSize },
      { array: vao.uv, size: this.uvSize },
      { array: vao.color, size: this.colorSize },
      { array: vao.normal, size: this.normalSize },
      { array: vao.tangent, size: this.tangentSize },
    ];

    let offset = 0;
    for (const attr of attributes) {
      // 分割数据并填充到VAO的相应属性中
      offset = this.splitVertexData(index, this.vertexData, attr.array, attr.size, offset);
    }
    return vao;
  }

  /** 分割数据并填充到输出数组中 */
  splitVertexData(index: number, input: Float32Array, output: number[], size: number, offset: number) {
    let start = this.vertexSize * index + offset;
    for (let i = 0; i < size; ++i) {
      output[i] = input[start + i];
    }
    return offset + size;
  }
}
