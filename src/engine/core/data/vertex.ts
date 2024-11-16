import { Vec2 } from '@/engine/math/vector/vec2';
import { Vec3 } from '@/engine/math/vector/vec3';
import Vec4 from '@/engine/math/vector/vec4';

/**
 * 顶点类
 */
export class Vertex {
  /** 位置 */
  position: Vec3;
  /** 颜色 */
  color: Vec4;
  /** 纹理坐标 */
  uv: Vec2;
  /** 法线 */
  normal: Vec3;
}
