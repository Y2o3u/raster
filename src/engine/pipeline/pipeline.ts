import { RenderContext } from '../core/render-context';
import { Rasterizer } from '../rasterizer/base-rasterize';
import { RasterizerNormal } from '../rasterizer/rasterizer-normal';
import { RasterizerTriangle } from '../rasterizer/rasterizer-triangle';
import { Vertex } from '../core/data/vertex';
import Vec4 from '../math/vector/vec4';
import { Node } from '../core/node';
import { Mat4 } from '../math/matrix/mat4';
import { RasterizerDepth } from '../rasterizer/rasterizer-depth';

/** 渲染器列表 */
const RasterizerList = [RasterizerTriangle, RasterizerNormal, RasterizerDepth];

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
  constructor(width: number, height: number, renderMode?: RasterizerMode) {
    this.renderContext = new RenderContext();
    this.rasterizers = RasterizerList.map((rasterizer) => new rasterizer(width, height));
    this.renderMode = renderMode ?? RasterizerMode.Normal;
  }

  /** 设置渲染模式 */
  setRenderMode(mode: RasterizerMode) {
    this.renderMode = mode;
  }

  /** 设置是否开启MSAA抗锯齿 */
  setEnableMSAA(enable: boolean) {
    this.rasterizers.forEach((rasterizer) => rasterizer.setEnableMSAA(enable));
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
    // 渲染上下文
    const renderContext = this.renderContext;

    // 过一遍顶点着色器、坐标转换
    for (let i = 0; i < vertexCount; i++) {
      vertexs[i] = new Vertex();
      const outPosition = renderContext.vs.main(renderContext, vbo.getVertexVAO(i), vertexs[i]);
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

      // 面剔除、超过一个三角形才触发
      if (!this.isCCW(p0.clone(), p1.clone(), p2.clone())) {
        continue;
      }

      // 光栅化
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
   * 行列式, 计算三角形是顺时针还是逆时针, 用于背面剔除
   * @param p0
   * @param p1
   * @param p2
   * @private
   */
  private isCCW(p0: Vec4, p1: Vec4, p2: Vec4): boolean {
    p0.standardized();
    p1.standardized();
    p2.standardized();
    const a = p1.x - p0.x;
    const b = p1.y - p0.y;
    const c = p2.x - p0.x;
    const d = p2.y - p0.y;
    return a * d - b * c < 0;
  }

  /**
   * 获取帧缓冲
   * @returns 帧缓冲
   */
  getFrameBuffer() {
    return this.rasterizers[this.renderMode].getFrameBuffer();
  }

  clear() {
    this.rasterizers.forEach((rasterizer) => rasterizer.clear());
  }
}
