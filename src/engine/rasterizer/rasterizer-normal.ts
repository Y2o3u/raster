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
    // 经过投影变换、深度值在w分量上
    const z0 = p0.w;
    const z1 = p1.w;
    const z2 = p2.w;

    // 透视除法、将w分量归一化、参考齐次坐标
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

        for (let i = 0; i < samplePoints.length; i++) {
          let [offsetX, offsetY] = samplePoints[i];
          let curX = x + offsetX;
          let curY = y + offsetY;

          // 计算重心坐标
          let { alpha, beta, gamma } = getBaryCentricCoord(curX, curY, p0, p1, p2);

          // 不在三角形内、重心定义
          if (alpha < 0 || beta < 0 || gamma < 0) continue;

          // 通过投影后三角形内的点P'的α'、β'、γ'，计算出投影前三角形内的点P的深度值
          // https://blog.csdn.net/Motarookie/article/details/124284471
          const Z = 1 / (alpha / z0 + beta / z1 + gamma / z2);
          let z = (alpha * p0.z) / z0 + (beta * p1.z) / z1 + (gamma * p2.z) / z2;
          z *= Z;

          // 透视矫正
          alpha *= Z / z0;
          beta *= Z / z1;
          gamma *= Z / z2;

          // 深度测试、子采样点
          if (this.isEnableMSAA ? !this.superSampleZBuffer?.zTest(x, y, z, i) : !this.zBuffer?.zTest(x, y, z)) continue;

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
            color = renderContext.shader.frag(renderContext, this.variable);
            this.frameBuffer.setColor(x, y, color);
          } else {
            for (let i = 0; i < samplePoints.length; i++) {
              color.add(this.superSampleBuffer.getColor(x, y, i), color);
            }
            color.x /= samplePoints.length;
            color.y /= samplePoints.length;
            color.z /= samplePoints.length;
            color.w = 1;

            this.variable.color = color;
            // 走一遍片段着色器
            color = renderContext.shader.frag(renderContext, this.variable);
            this.frameBuffer.setColor(x, y, this.variable.color);
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
