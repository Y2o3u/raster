import { VAO } from '../core/data/vao';
import { Vertex } from '../core/data/vertex';
import { RenderContext } from '../core/render-context';
import { Vec2 } from '../math/vector/vec2';
import Vec4 from '../math/vector/vec4';

/** 仿照UnityShader */
export class Shader {
  /** 默认颜色 */
  defaultColor: Vec4 = Vec4.fromArray([1, 1, 1, 1]);

  /** 顶点着色器、输出裁剪空间坐标 */
  vert(context: RenderContext, inputVAO: VAO, vertexOut: Vertex): Vec4 {
    const coord = Vec4.fromArray([inputVAO.position[0], inputVAO.position[1], inputVAO.position[2], 1]);
    return context.matMVP.mul(coord);
  }

  /** 片元着色器、输出颜色 */
  frag(context: RenderContext, input: Vertex): Vec4 {
    return input.color || this.defaultColor;
  }

}
