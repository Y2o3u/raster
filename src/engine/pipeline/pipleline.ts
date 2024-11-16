import { RenderContext } from '../core/render-context';
import { FragmentShader } from '../shader/fragment/fragment-shader';
import { VertexShader } from '../shader/vertext/vertex-shader';
import { Rasterizer } from '../rasterizer/base-rasterize';
import { RasterizerNormal } from '../rasterizer/rasterizer-normal';
import { RasterizerTriangle } from '../rasterizer/rasterizer-triangle';
import { VBO } from '../core/data/vbo';
import { Vertex } from '../core/data/vertex';
import Vec4 from '../math/vector/vec4';
import { Node } from '../core/node';

/** 渲染器列表 */
const RasterizerList = [RasterizerTriangle, RasterizerNormal];

/** 渲染模式 */
export enum RasterizerMode {
  Triangle,
  Normal,
  Depth,
}

/** 渲染管线 */
export class Pipeline {
  /** 光栅化器 */
  rasterizers: Rasterizer[];
  /** 渲染上下文 */
  renderContext: RenderContext;
  /** 当前渲染模式 */
  renderMode: RasterizerMode = RasterizerMode.Normal;

  /**
   * @param width 宽度
   * @param height 高度
   * @param renderMode 光栅化器类型
   */
  constructor(width: number, height: number, renderMode: RasterizerMode) {
    this.renderContext = new RenderContext();
    this.rasterizers = RasterizerList.map((rasterizer) => new rasterizer(width, height));
    this.renderMode = renderMode;
  }

  /**
   * 渲染
   * @param vbo - 顶点缓冲
   * @param indices - 索引
   */
  renderNode(node: Node) {
    // 获取顶点缓冲、索引
    const vbo = node.getVertexBuffer();
    const indices = node.getIndicesBuffer();

    // 顶点数量
    const vertexCount = vbo.getVertexCount();
    // 顶点着色器执行后的顶点数据、由数组转成Vertex对象
    const vertexs: Vertex[] = new Array(vertexCount);
    // 顶点着色器执行后的位置
    const position: Vec4[] = new Array(vertexCount);

    const renderContext = this.renderContext;
    // 过一遍顶点着色器、坐标转换
    for (let i = 0; i < vertexCount; i++) {
      vertexs[i] = new Vertex();
      const outPosition = renderContext.vs.main(this.renderContext, vbo.getVertexVAO(i), vertexs[i]);
      // 将顶点坐标转换到屏幕坐标
      position[i] = renderContext.matViewport.multiply(outPosition);
    }

    // 使用当前模式下的光栅化器、遍历三角形、得到像素数据
    const rasterizer = this.rasterizers[this.renderMode];
    // 光栅化、组装三角形再遍历
    const triangleCount = indices.length / 3;
    for (let i = 0; i < triangleCount; i++) {
      const p0 = position[indices[i * 3]];
      const p1 = position[indices[i * 3 + 1]];
      const p2 = position[indices[i * 3 + 2]];
      rasterizer.run(
        p0,
        p1,
        p2,
        vertexs[indices[i * 3]],
        vertexs[indices[i * 3 + 1]],
        vertexs[indices[i * 3 + 2]],
        this.renderContext
      );
    }
  }

  /**
   * 获取帧缓冲
   * @returns 帧缓冲
   */
  getFrameBuffer() {
    return this.rasterizers[this.renderMode].frameBuffer.getFrameBuffer();
  }

  clear() {
    this.rasterizers.forEach((rasterizer) => rasterizer.clear());
  }
}
