import { FrameBuffer } from '../buffer/frame/frame-buffer';
import { Vertex } from '../core/data/vertex';
import { RenderContext } from '../core/render-context';
import { cross, getBaryCentricCoord, getBoundBox } from '../math/utils/util';
import Vec4 from '../math/vector/vec4';
import { Rasterizer } from './base-rasterize';

/**
 * 深度光栅化器
 */
export class RasterizerDepth extends Rasterizer {
  /**
   * 渲染
   * @param p0 三角形顶点0
   * @param p1 三角形顶点1
   * @param p2 三角形顶点2
   * @param v0 三角形顶点0的顶点数据
   * @param v1 三角形顶点1的顶点数据
   * @param v2 三角形顶点2的顶点数据
   */
  run(p0: Vec4, p1: Vec4, p2: Vec4, v0: Vertex, v1: Vertex, v2: Vertex, renderContext: RenderContext): void {
    const z0 = p0.w;
    const z1 = p1.w;
    const z2 = p2.w;

    // 透视除法
    p0.standardized();
    p1.standardized();
    p2.standardized();

    // 计算三角形面积
    const s = cross(p1.x - p0.x, p1.y - p0.y, p2.x - p0.x, p2.y - p0.y) / 2;
    if (s == 0) return;

    // 获取三角形包围盒
    const boundBox = getBoundBox(this.width, this.height, p0, p1, p2);
    for (let x = boundBox.x; x < boundBox.z; ++x) {
      for (let y = boundBox.y; y < boundBox.w; ++y) {
        const curX = x + 0.5;
        const curY = y + 0.5;

        // 计算重心坐标
        const { alpha, beta, gamma } = getBaryCentricCoord(curX, curY, p0, p1, p2);

        // 不在三角形内
        if (alpha < 0 || beta < 0 || gamma < 0) continue;

        // 插值深度
        // let z = (1 / z0) * alpha + (1 / z1) * beta + (1 / z2) * gamma;

        // 通过投影后三角形内的点P'的α'、β'、γ'，计算出投影前三角形内的点P的深度值
        const Z = 1 / (alpha / z0 + beta / z1 + gamma / z2);
        // 插值深度
        let z = (alpha * p0.z) / z0 + (beta * p1.z) / z1 + (gamma * p2.z) / z2;
        // 矫正深度
        z *= Z;

        // 深度测试
        if (!this.zBuffer.zTest(x, y, z)) continue;

        // 更新深度缓冲区
        this.zBuffer.setZ(x, y, z);
        // 深度写入frameBuffer的RGB通道
        this.frameBuffer.setColor(x, y, new Vec4(z, z, z, 1));
      }
    }
  }

  clear() {
    // this.frameBuffer.setClearColor(new Vec4(1, 1, 1, 1));
    this.zBuffer.clear();
    this.frameBuffer.clear();
  }
}
