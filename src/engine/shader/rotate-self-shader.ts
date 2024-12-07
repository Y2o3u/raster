import { VAO } from '../core/data/vao';
import { Vertex } from '../core/data/vertex';
import { RenderContext } from '../core/render-context';
import { Mat4 } from '../math/matrix/mat4';
import { Vec2 } from '../math/vector/vec2';
import { Vec3 } from '../math/vector/vec3';
import Vec4 from '../math/vector/vec4';
import { Shader } from './shader';

/** 自转着色器 */
export class RotateSelfShader extends Shader {
  /** 默认颜色 */
  defaultColor: Vec4 = Vec4.fromArray([1, 1, 1, 1]);

  /** 顶点着色器 */
  vert(context: RenderContext, inputVAO: VAO, vertexOut: Vertex): Vec4 {
    // 齐次坐标
    const coord = Vec4.fromArray([inputVAO.position[0], inputVAO.position[1], inputVAO.position[2], 1]);
    const time = context.time;
    // prettier-ignore
    const rotationMat = Mat4.rotationY(time * 40);
    // 应用旋转矩阵
    let position = rotationMat.mul(coord);
    // 法线旋转
    const normal = rotationMat.mul(Vec4.fromArray([inputVAO.normal[0], inputVAO.normal[1], inputVAO.normal[2], 0]));
    // 转化为顶点数据
    vertexOut.position = context.matWorld.mul(position).xyz;
    vertexOut.normal = Vec3.fromArray([normal.x, normal.y, normal.z]);
    vertexOut.normal = context.matWorld.mul(normal).xyz;
    vertexOut.uv = Vec2.fromArray([inputVAO.uv[0], inputVAO.uv[1]]);
    vertexOut.color = Vec4.fromArray([inputVAO.color[0], inputVAO.color[1], inputVAO.color[2], 1]);

    position = context.matMVP.mul(position);
    return position;
  }

  /** 片元着色器 */
  frag(context: RenderContext, input: Vertex): Vec4 {
    const texture = context.getTexture(0);
    if (!texture) {
      return new Vec4(1, 1, 1, 1);
    }
    // 纹理采样
    const color = texture.getColorByUV(input.uv.x, input.uv.y);
    return color;
  }
}
