import { FrameBuffer } from '../buffer/frame/frame-buffer';
import { Vertex } from '../core/data/vertex';
import { barycentricInterpolation, cross, getBaryCentricCoord, getBoundBox } from '../math/utils/util';
import Vec4 from '../math/vector/vec4';

export class RasterizerNormal {
  /** 帧缓冲 */
  private frameBuffer: FrameBuffer;
  /** 屏幕宽高 */
  private width: number = 0;
  private height: number = 0;

  private readonly variable: Vertex;

  constructor(width: number, height: number) {
    this.variable = new Vertex();
    this.width = width;
    this.height = height;
    // this.zBuffer = new ZBuffer1x(width, height);
    this.frameBuffer = new FrameBuffer(width, height);
  }

  run(p0: Vec4, p1: Vec4, p2: Vec4, v0: Vertex, v1: Vertex, v2: Vertex): void {
    const z0 = p0.w;
    const z1 = p1.w;
    const z2 = p2.w;

    p0.standardized();
    p1.standardized();
    p2.standardized();

    const s = cross(p1.x - p0.x, p1.y - p0.y, p2.x - p0.x, p2.y - p0.y) / 2;
    if (s == 0) return;

    let boundBox = getBoundBox(this.width, this.height, p0, p1, p2);
    for (let x = boundBox.x; x < boundBox.z; ++x) {
      for (let y = boundBox.y; y < boundBox.w; ++y) {
        let color = new Vec4(0, 0, 0, 1);
        let count = 0;

        // 定义4x4的采样点
        const samplePoints = [
          [0.25, 0.25],
          [0.75, 0.25],
          [0.25, 0.75],
          [0.75, 0.75],
        ];

        for (let [offsetX, offsetY] of samplePoints) {
          let curX = x + offsetX;
          let curY = y + offsetY;

          // 计算重心坐标
          let { alpha, beta, gamma } = getBaryCentricCoord(curX, curY, p0, p1, p2);
          // 不在三角形内
          if (alpha < 0 || beta < 0 || gamma < 0) {
            continue;
          }

          let z = (1 / z0) * alpha + (1 / z1) * beta + (1 / z2) * gamma;
          z = 1 / z;

          alpha = (alpha / z0) * z;
          beta = (beta / z1) * z;
          gamma = (gamma / z2) * z;

          // 重心坐标插值
          barycentricInterpolation(v0, v1, v2, alpha, beta, gamma, this.variable);
          color.x += this.variable.color.x;
          color.y += this.variable.color.y;
          color.z += this.variable.color.z;
          color.w += this.variable.color.w;
          count++;
        }

        if (count > 0) {
          color.x /= 4;
          color.y /= 4;
          color.z /= 4;
          color.w /= count;
          this.frameBuffer.setColor(x, y, color);
        } else {
          this.frameBuffer.setColor(x, y, new Vec4(0, 0, 0, 1));
        }
      }
    }
  }

  public getFrameBuffer(): Float32Array {
    return this.frameBuffer.getFrameBuffer();
  }

  clear() {
    // this.zBuffer.clear();
    this.frameBuffer.clearBuffer();
  }
}
