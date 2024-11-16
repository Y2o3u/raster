import Vec4 from '@/engine/math/vector/vec4';

export class FrameBuffer {
  private frameBuffer: Float32Array;
  private clearColor: Vec4 = new Vec4(0, 0, 0, 1);
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.frameBuffer = new Float32Array(this.width * this.height * 4);
  }

  setColor(x: number, y: number, color: Vec4, extra?: any): void {
    let index = (x + y * this.width) * 4;
    this.frameBuffer[index] = color.x;
    this.frameBuffer[index + 1] = color.y;
    this.frameBuffer[index + 2] = color.z;
    this.frameBuffer[index + 3] = color.w;
  }

  setClearColor(color: Vec4): void {
    this.clearColor.fromVec4(color);
  }

  clearBuffer(): void {
    let len = this.frameBuffer.length / 4;
    for (let i = 0; i < len; ++i) {
      let idx = 4 * i;
      this.frameBuffer[idx] = this.clearColor.x;
      this.frameBuffer[idx + 1] = this.clearColor.y;
      this.frameBuffer[idx + 2] = this.clearColor.z;
      this.frameBuffer[idx + 3] = this.clearColor.w;
    }
  }

  getFrameBuffer(): Float32Array {
    return this.frameBuffer;
  }
}
