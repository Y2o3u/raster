import { FrameBuffer } from '../buffer/frame/frame-buffer';
import { Vertex } from '../core/data/vertex';
import { RenderContext } from '../core/render-context';
import Vec4 from '../math/vector/vec4';
import { Rasterizer } from './base-rasterize';

/**
 * 三角形光栅化器
 */
export class RasterizerTriangle extends Rasterizer {
  /**
   * 渲染
   * @param p0 三角形顶点0
   * @param p1 三角形顶点1
   * @param p2 三角形顶点2
   * @param v0 三角形顶点0的顶点数据
   * @param v1 三角形顶点1的顶点数据
   * @param v2 三角形顶点2的顶点数据
   */
  public run(p0: Vec4, p1: Vec4, p2: Vec4, v0: Vertex, v1: Vertex, v2: Vertex, renderContext: RenderContext): void {
    p0.standardized();
    p1.standardized();
    p2.standardized();
    this.line(p0.x, p0.y, p1.x, p1.y);
    this.line(p2.x, p2.y, p1.x, p1.y);
    this.line(p0.x, p0.y, p2.x, p2.y);
  }

  /**
   * 画线
   * @param x0 起点x坐标
   * @param y0 起点y坐标
   * @param x1 终点x坐标
   * @param y1 终点y坐标
   */
  private line(x0: number, y0: number, x1: number, y1: number): void {
    x0 = Math.round(x0);
    y0 = Math.round(y0);
    y1 = Math.round(y1);
    x1 = Math.round(x1);
    const steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
    let temp = 0;
    if (steep) {
      temp = x0;
      x0 = y0;
      y0 = temp;
      temp = x1;
      x1 = y1;
      y1 = temp;
    }
    if (x0 > x1) {
      temp = x0;
      x0 = x1;
      x1 = temp;
      temp = y0;
      y0 = y1;
      y1 = temp;
    }
    const deltaX = x1 - x0;
    const deltaY = Math.abs(y1 - y0);

    let error = deltaX / 2;
    let yStep: number;
    let y = y0;

    if (y0 < y1) {
      yStep = 1;
    } else {
      yStep = -1;
    }

    for (let x = x0; x < x1; x++) {
      if (steep) {
        this.setColor(y, x);
      } else {
        this.setColor(x, y);
      }
      error = error - deltaY;
      if (error < 0) {
        y = y + yStep;
        error = error + deltaX;
      }
    }
  }

  /**
   * 设置颜色
   * @param x 像素x坐标
   * @param y 像素y坐标
   */
  private setColor(x: number, y: number): void {
    if (x >= this.width || x < 0 || y > this.height || y < 0) {
      return;
    }
    this.frameBuffer.setColor(x, y, new Vec4(1, 0, 0, 1));
  }
}
