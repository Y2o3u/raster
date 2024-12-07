import { VAO } from '../core/data/vao';
import { Vertex } from '../core/data/vertex';
import { RenderContext } from '../core/render-context';
import { Mat4 } from '../math/matrix/mat4';
import { Vec2 } from '../math/vector/vec2';
import { Vec3 } from '../math/vector/vec3';
import Vec4 from '../math/vector/vec4';
import { Shader } from './shader';

/** 纹理映射着色器 */
export class TextureApplyShader extends Shader {
  /** 默认颜色 */
  defaultColor: Vec4 = Vec4.fromArray([1, 1, 1, 1]);

  /** 顶点着色器 */
  vert(context: RenderContext, inputVAO: VAO, vertexOut: Vertex): Vec4 {
    // 齐次坐标
    const coord = Vec4.fromArray([inputVAO.position[0], inputVAO.position[1], inputVAO.position[2], 1]);
    const rotationMat = Mat4.rotationY(context.time * 40);
    let position = rotationMat.mul(coord);

    vertexOut.position = context.matWorld.mul(position).xyz;
    vertexOut.uv = Vec2.fromArray([inputVAO.uv[0], inputVAO.uv[1]]);

    if (context.getTexture(0)) {
      vertexOut.color = context.getTexture(0).getColorByUV(vertexOut.uv.x, vertexOut.uv.y, vertexOut.color);
    }
    // 应用MVP变换、将顶点转化到 NDC裁剪空间内 【NDC裁剪空间：-1到1】
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
