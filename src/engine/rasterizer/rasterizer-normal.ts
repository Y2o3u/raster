import { Vertex } from '../core/data/vertex';
import { RenderContext } from '../core/render-context';
import { barycentricInterpolation, cross, getBaryCentricCoord, getBoundBox } from '../math/utils/util';
import Vec4 from '../math/vector/vec4';
import { Rasterizer } from './base-rasterize';

/**
 * 普通光栅化器
 */
export class RasterizerNormal extends Rasterizer {
  /** 顶点着色器输出 */
  private readonly variable: Vertex = new Vertex();

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
    const s = cross(p1.x - p0.x, p1.y - p0.y, p2.x - p0.x, p2.y - p0.y);
    if (s == 0) return;

    // 获取三角形包围盒
    const boundBox = getBoundBox(this.width, this.height, p0, p1, p2);
    for (let x = boundBox.x; x < boundBox.z; ++x) {
      for (let y = boundBox.y; y < boundBox.w; ++y) {
        // 颜色
        let color = new Vec4(0, 0, 0, 1);
        // 是否在三角形内
        let insideTriangle = false;
        // 根据是否开启MSAA 定义采样点
        const samplePoints = this.isEnableMSAA
          ? [
              [0.25, 0.25],
              [0.75, 0.25],
              [0.25, 0.75],
              [0.75, 0.75],
            ]
          : [[0.5, 0.5]];

        // 几个采样点最大深度（靠近相机）
        for (let i = 0; i < samplePoints.length; i++) {
          let [offsetX, offsetY] = samplePoints[i];
          let curX = x + offsetX;
          let curY = y + offsetY;

          // 计算重心坐标
          let { alpha, beta, gamma } = getBaryCentricCoord(curX, curY, p0, p1, p2);
          // 不在三角形内
          if (alpha < 0 || beta < 0 || gamma < 0) continue;

          // 插值深度
          let nz = p0.z * alpha + p1.z * beta + p2.z * gamma;

          // 透视插值矫正
          let z = (1 / z0) * alpha + (1 / z1) * beta + (1 / z2) * gamma;
          z = 1 / z;
          alpha = (alpha / z0) * z;
          beta = (beta / z1) * z;
          gamma = (gamma / z2) * z;

          // 深度测试、子采样点
          if (this.isEnableMSAA ? !this.superSampleZBuffer?.zTest(x, y, nz, i) : !this.zBuffer?.zTest(x, y, nz))
            continue;

          // 重心坐标插值各种属性
          barycentricInterpolation(v0, v1, v2, alpha, beta, gamma, this.variable);

          if (this.isEnableMSAA) {
            this.superSampleBuffer?.setColor(x, y, this.variable.color, i);
          }
          // 在三角形内
          insideTriangle = true;
        }

        // RGB平均、透明度不变、使用超采样样本填充
        if (insideTriangle) {
          // 兼容没有开启MSAA
          if (!this.isEnableMSAA) {
            color = renderContext.fs.main(renderContext, this.variable);
            this.frameBuffer.setColor(x, y, color);
          } else {
            for (let i = 0; i < samplePoints.length; i++) {
              color.add(this.superSampleBuffer.getColor(x, y, i), color);
            }
            color.x /= samplePoints.length;
            color.y /= samplePoints.length;
            color.z /= samplePoints.length;
            color.w = 1;

            // 走一遍片段着色器
            color = renderContext.fs.main(renderContext, this.variable);
            this.frameBuffer.setColor(x, y, color);
          }
        }
      }
    }
  }

  clear() {
    this.zBuffer.clear();
    this.frameBuffer.clear();
    this.superSampleBuffer?.clear();
    this.superSampleZBuffer?.clear();
  }
}
