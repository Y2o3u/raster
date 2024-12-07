import { RenderContext } from '../core/render-context';
import { Rasterizer } from '../rasterizer/base-rasterize';
import { RasterizerNormal } from '../rasterizer/rasterizer-normal';
import { RasterizerTriangle } from '../rasterizer/rasterizer-triangle';
import { Vertex } from '../core/data/vertex';
import Vec4 from '../math/vector/vec4';
import { Node } from '../core/node';
import { RasterizerDepth } from '../rasterizer/rasterizer-depth';
import { getBaryCentricCoord } from '../math/utils/util';

/** 渲染器列表 */
const RasterizerList = [RasterizerTriangle, RasterizerNormal, RasterizerDepth];

/** 光栅化模式 */
export enum RasterizerMode {
  Triangle,
  Normal,
  Depth,
}

/** 正面、背面、关闭剔除 */
export enum FaceCulling {
  Front,
  Back,
  Off,
}

/** 渲染管线 */
export class Pipeline {
  /** 光栅化器 */
  rasterizers: Rasterizer[];
  /** 渲染上下文 */
  renderContext: RenderContext;
  /** 当前渲染模式 */
  renderMode: RasterizerMode = RasterizerMode.Normal;
  /** 当前剔除模式 */
  faceCulling: FaceCulling = FaceCulling.Front;

  /**
   * @param width 宽度
   * @param height 高度
   * @param renderMode 光栅化器类型
   */
  constructor(width: number, height: number, renderMode?: RasterizerMode) {
    this.renderContext = new RenderContext();
    this.rasterizers = RasterizerList.map((rasterizer) => new rasterizer(width, height));
    this.renderMode = renderMode ?? RasterizerMode.Normal;
    this.faceCulling = FaceCulling.Back;
  }

  /** 设置渲染模式 */
  setRenderMode(mode: RasterizerMode) {
    this.renderMode = mode;
  }

  /** 设置是否开启MSAA抗锯齿 */
  setEnableMSAA(enable: boolean) {
    this.rasterizers.forEach((rasterizer) => rasterizer.setEnableMSAA(enable));
  }

  /** 设置面剔除 */
  setFaceCulling(mode: FaceCulling) {
    this.faceCulling = mode;
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
      const outPosition = renderContext.shader.vert(renderContext, vbo.getVertexVAO(i), vertexs[i]);
      // 将顶点坐标转换到屏幕坐标
      position[i] = renderContext.matViewport.mul(outPosition);
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
      if (this.faceCulling !== FaceCulling.Off && triangleCount > 1) {
        const isCCW = this.isCCW(p0.clone(), p1.clone(), p2.clone());
        const shouldCull =
          (this.faceCulling === FaceCulling.Back && !isCCW) || (this.faceCulling === FaceCulling.Front && isCCW);
        if (shouldCull) {
          continue;
        }
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
   * 判断三角形是否为逆时针顺序、简化版
   * @param p0
   * @param p1
   * @param p2
   * @returns 是否为逆时针
   */
  private isCCW(p0: Vec4, p1: Vec4, p2: Vec4): boolean {
    p1.standardized();
    p2.standardized();
    p0.standardized();

    const edge1 = p1.sub(p0);
    const edge2 = p2.sub(p0);
    const normal = edge1.xyz.cross(edge2.xyz);
    return normal.z < 0;
  }

  /**
   * 考虑观察者位置的 判断三角形是否为逆时针顺序
   * @param p0
   * @param p1
   * @param p2
   * @returns 是否为逆时针
   * @private
   */
  private isCCWConsideringObserver(p0: Vec4, p1: Vec4, p2: Vec4): boolean {
    // 确保顶点在视图空间中
    p0.standardized();
    p1.standardized();
    p2.standardized();

    // 计算边向量
    const edge1 = p1.sub(p0);
    const edge2 = p2.sub(p0);
    // 计算法向量
    const normal = edge1.xyz.cross(edge2.xyz);
    // 观察者方向（视图空间中观察者在原点）
    const observerDirection = new Vec4(0, 0, -1, 0); // 假设观察者看向负z方向
    // 计算法向量和观察者方向的点积
    const dotProduct = normal.x * observerDirection.x + normal.y * observerDirection.y + normal.z * observerDirection.z;
    // 如果点积大于0，说明法向量朝向观察者，即为逆时针
    return dotProduct > 0;
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
