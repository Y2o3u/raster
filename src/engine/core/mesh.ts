import { VBO } from './data/vbo';

/**
 * 网格、存放顶点缓冲和索引缓冲
 */
export class Mesh {
  /** 顶点缓冲 */
  vertexBuffer: VBO;
  /** 索引缓冲 */
  indexBuffer: number[];

  /**
   * @param vertexBuffer 顶点缓冲
   * @param indexBuffer 索引缓冲
   */
  constructor(vertexBuffer: VBO, indexBuffer: number[]) {
    this.vertexBuffer = vertexBuffer;
    this.indexBuffer = indexBuffer;
  }

  /** 设置顶点缓冲 */
  setVertexBuffer(vertexBuffer: VBO): void {
    this.vertexBuffer = vertexBuffer;
  }

  /** 设置索引缓冲 */
  setIndexBuffer(indexBuffer: number[]): void {
    this.indexBuffer = indexBuffer;
  }

  /** 获取顶点缓冲 */
  getVertexBuffer(): VBO {
    return this.vertexBuffer;
  }

  /** 获取索引缓冲 */
  getIndexBuffer(): number[] {
    return this.indexBuffer;
  }
}
