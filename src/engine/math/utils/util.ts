import { Vertex } from '@/engine/core/data/vertex';
import Vec4 from '../vector/vec4';
import { Vec3 } from '../vector/vec3';
import { Vec2 } from '../vector/vec2';

/**
 * 重心坐标计算
 * @param x
 * @param y
 * @param v1
 * @param v2
 * @param v3
 * @returns
 */
export function getBaryCentricCoord(x: number, y: number, v1: Vec4, v2: Vec4, v3: Vec4) {
  // 三角形总面积 = AB X AC
  let totalS = cross(v2.x - v1.x, v2.y - v1.y, v3.x - v1.x, v3.y - v1.y) / 2;
  let alpha = cross(x - v2.x, y - v2.y, x - v3.x, y - v3.y) / 2 / totalS;
  let beta = cross(x - v3.x, y - v3.y, x - v1.x, y - v1.y) / 2 / totalS;
  let gamma = 1 - alpha - beta;
  return { alpha, beta, gamma };
}

/**
 * 叉积计算
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns
 */
export function cross(x1: number, y1: number, x2: number, y2: number) {
  return x1 * y2 - x2 * y1;
}

/**
 * 计算包围盒
 * @param width
 * @param height
 * @param p0
 * @param p1
 * @param p2
 * @param out
 * @returns
 */
export function getBoundBox(width: number, height: number, p0: Vec4, p1: Vec4, p2: Vec4, out?: Vec4): Vec4 {
  if (!out) out = new Vec4();
  out.x = Math.min(p0.x, p1.x, p2.x);
  if (out.x < 0) {
    out.x = 0;
  }

  out.y = Math.min(p0.y, p1.y, p2.y);
  if (out.y < 0) {
    out.y = 0;
  }

  out.z = Math.max(p0.x, p1.x, p2.x);
  if (out.z > width) {
    out.z = width;
  }

  out.w = Math.max(p0.y, p1.y, p2.y);
  if (out.w > height) {
    out.w = height;
  }
  out.x = Math.round(out.x);
  out.y = Math.round(out.y);
  out.z = Math.round(out.z);
  out.w = Math.round(out.w);
  return out;
}

/**
 * 将三个顶点的数据进行重心坐标插值
 */
export function barycentricInterpolation(
  v0: Vertex,
  v1: Vertex,
  v2: Vertex,
  alpha: number,
  beta: number,
  gamma: number,
  out?: Vertex
): Vertex {
  if (!out) {
    out = new Vertex();
  }
  if (v0.position) {
    out.position = barycentricInterpolationVec3(
      v0.position,
      v1.position,
      v2.position,
      alpha,
      beta,
      gamma,
      out.position
    );
  }
  if (v0.normal) {
    out.normal = barycentricInterpolationVec3(v0.normal, v1.normal, v2.normal, alpha, beta, gamma, out.normal);
  }
  if (v0.uv) {
    out.uv = this.barycentricVec2(v0.uv, v1.uv, v2.uv, alpha, beta, gamma, out.uv);
  }
  if (v0.color) {
    out.color = barycentricInterpolationVec4(v0.color, v1.color, v2.color, alpha, beta, gamma, out.color);
  }
  return out;
}

/*** 重心坐标插值vec4 */
export function barycentricInterpolationVec4(
  v0: Vec4,
  v1: Vec4,
  v2: Vec4,
  alpha: number,
  beta: number,
  gamma: number,
  out?: Vec4
): Vec4 {
  if (!out) {
    out = new Vec4();
  }
  out.x = v0.x * alpha + v1.x * beta + v2.x * gamma;
  out.y = v0.y * alpha + v1.y * beta + v2.y * gamma;
  out.z = v0.z * alpha + v1.z * beta + v2.z * gamma;
  out.w = v0.w * alpha + v1.w * beta + v2.w * gamma;
  return out;
}

/*** 重心坐标插值vec3 */
export function barycentricInterpolationVec3(
  v0: Vec3,
  v1: Vec3,
  v2: Vec3,
  alpha: number,
  beta: number,
  gamma: number,
  out?: Vec3
): Vec3 {
  if (!out) {
    out = new Vec3();
  }
  out.x = v0.x * alpha + v1.x * beta + v2.x * gamma;
  out.y = v0.y * alpha + v1.y * beta + v2.y * gamma;
  out.z = v0.z * alpha + v1.z * beta + v2.z * gamma;
  return out;
}

/*** 重心坐标插值vec2 */
export function barycentricInterpolationVec2(
  v0: Vec2,
  v1: Vec2,
  v2: Vec2,
  alpha: number,
  beta: number,
  gamma: number,
  out?: Vec2
): Vec2 {
  if (!out) {
    out = new Vec2();
  }
  out.x = v0.x * alpha + v1.x * beta + v2.x * gamma;
  out.y = v0.y * alpha + v1.y * beta + v2.y * gamma;
  return out;
}
