import { Vertex } from '@/engine/core/data/vertex';
import Vec4 from '../vector/vec4';
import { Vec3 } from '../vector/vec3';
import { Vec2 } from '../vector/vec2';
import { VAO } from '@/engine/core/data/vao';
import { VBO } from '@/engine/core/data/vbo';

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
  if (v0.normal)
    out.normal = barycentricInterpolationVec3(v0.normal, v1.normal, v2.normal, alpha, beta, gamma, out.normal);
  if (v0.uv) out.uv = barycentricInterpolationVec2(v0.uv, v1.uv, v2.uv, alpha, beta, gamma, out.uv);
  if (v0.color) out.color = barycentricInterpolationVec4(v0.color, v1.color, v2.color, alpha, beta, gamma, out.color);
  if (v0.tangent)
    out.tangent = barycentricInterpolationVec4(v0.tangent, v1.tangent, v2.tangent, alpha, beta, gamma, out.tangent);
  if (v0.bitangent)
    out.bitangent = barycentricInterpolationVec3(
      v0.bitangent,
      v1.bitangent,
      v2.bitangent,
      alpha,
      beta,
      gamma,
      out.bitangent
    );
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

/**
 * 将VAO离散数据合并成单一完整的VBO数据
 * @param vao
 * @param position
 * @param uv
 * @param color
 * @param normal
 * @param tangent
 * @constructor
 */
export function VAO2VBO(vao: VAO, position = 3, uv = 2, color = 3, normal = 3, tangent = 3): VBO {
  const vbo = new VBO(position, uv, color, normal, tangent);
  const size = position + uv + color + normal + tangent;

  // pLen 为所有坐标xyz的集合
  const pLen = vao.position.length;
  // pCount 将所有集合 / 坐标长度, 结果为顶点数量
  const pCount = pLen / position;
  vbo.setVertexCount(pCount);
  const data: number[] = new Array(pCount * size);
  let offset = 0;
  // position
  offset = dataMerge(data, vao.position, size, position, pCount, offset);
  offset = dataMerge(data, vao.uv, size, uv, pCount, offset);
  offset = dataMerge(data, vao.color, size, color, pCount, offset);
  offset = dataMerge(data, vao.normal, size, normal, pCount, offset);
  offset = dataMerge(data, vao.tangent, size, tangent, pCount, offset);
  vbo.setVertexData(data);
  return vbo;
}

/**
 *
 * @param out 最终输出数组
 * @param input voa输入的各个数组
 * @param lineSize voa 每个顶点数据的长度
 * @param variableSize 这一次处理的数据长度
 * @param vertexCount 总共有多少顶点要处理
 * @param offset 这一次处理的数据的偏移量
 */
function dataMerge(
  out: number[],
  input: number[],
  lineSize: number,
  variableSize: number,
  vertexCount: number,
  offset: number
) {
  for (let i = 0; i < vertexCount; ++i) {
    for (let j = 0; j < variableSize; ++j) {
      out[i * lineSize + j + offset] = input[i * variableSize + j];
    }
  }
  return offset + variableSize;
}

/**
 * 计算顶点切线、副切线
 * @param ver1
 * @param ver2
 * @param ver3
 * @returns
 */
export function calculateTangent(ver1: Vertex, ver2: Vertex, ver3: Vertex): { tangent: Vec4; bitangent: Vec3 } {
  const edge1 = ver2.position.sub(ver1.position);
  const edge2 = ver3.position.sub(ver1.position);

  const deltaUV1 = {
    x: ver2.uv.x - ver1.uv.x,
    y: ver2.uv.y - ver1.uv.y,
  };
  const deltaUV2 = {
    x: ver3.uv.x - ver1.uv.x,
    y: ver3.uv.y - ver1.uv.y,
  };

  const f = 1.0 / (deltaUV1.x * deltaUV2.y - deltaUV2.x * deltaUV1.y);

  const tangent = new Vec4();
  tangent.x = f * (deltaUV2.y * edge1.x - deltaUV1.y * edge2.x);
  tangent.y = f * (deltaUV2.y * edge1.y - deltaUV1.y * edge2.y);
  tangent.z = f * (deltaUV2.y * edge1.z - deltaUV1.y * edge2.z);
  tangent.normalize();

  const bitangent = new Vec3();
  bitangent.x = f * (-deltaUV2.x * edge1.x + deltaUV1.x * edge2.x);
  bitangent.y = f * (-deltaUV2.x * edge1.y + deltaUV1.x * edge2.y);
  bitangent.z = f * (-deltaUV2.x * edge1.z + deltaUV1.x * edge2.z);
  bitangent.normalize();

  return { tangent, bitangent };
}

/**
 * 将值限制在0-1之间
 * @param value
 * @returns
 */
export function saturate(value: number): number {
  return Math.max(0, Math.min(1, value));
}
