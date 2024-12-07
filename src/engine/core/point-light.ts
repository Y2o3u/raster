import Vec4 from '@/engine/math/vector/vec4';
import { Node } from './node';

/** 点光源 */
export class PointLight extends Node {
  /** 颜色 */
  color: Vec4;

  constructor() {
    super();
    this.color = new Vec4(1, 1, 1, 1);
  }
}
