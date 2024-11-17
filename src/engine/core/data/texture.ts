import Vec4 from '@/engine/math/vector/vec4';

/**
 * 纹理
 */
export class Texture {
  private img: ImageData = undefined;

  constructor(data?: ImageData) {
    if (data) {
      this.setImageData(data);
    }
  }

  /**
   * 设置图片数据
   * @param data 图片数据
   */
  public setImageData(data: ImageData): void {
    if (!data || !(data instanceof ImageData)) {
      console.error('set image data error, data is invalid, data: ', data);
      return;
    }
    this.img = data;
  }

  /*** 获取宽度 */
  public getWidth(): number {
    if (!this.img) {
      return 0;
    }
    return this.img.width;
  }

  /** 获取高度 */
  public getHeight(): number {
    if (!this.img) {
      return 0;
    }
    return this.img.height;
  }

  /**
   * 获取颜色
   * @param u u坐标
   * @param v v坐标
   * @param out 输出颜色
   */
  public getColorByUV(u: number, v: number, out?: Vec4): Vec4 {
    if (!this.img) {
      return new Vec4(0, 0, 0, 1);
    }

    u = u - Math.floor(u);
    v = v - Math.floor(v);

    const w = this.getWidth(),
      h = this.getHeight();
    const x = Math.round(w * u);
    const y = Math.round(h * (1 - v));
    const i = (y * w + x) * 4;
    const data = this.img.data;

    if (!out) {
      out = new Vec4();
    }
    out.set(data[i] / 255, data[i + 1] / 255, data[i + 2] / 255, data[i + 3] / 255);
    return out;
  }
}
