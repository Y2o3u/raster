import Vec4 from '@/engine/math/vector/vec4';

/** 球形光源 */
export class SphereLight {
  /** 位置 */
  position: Vec4;
  /** 颜色 */
  color: Vec4;

  constructor() {
    this.position = new Vec4();
    this.color = new Vec4(1, 1, 1, 1);
  }
}
