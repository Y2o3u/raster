import { VAO } from '@/engine/core/data/vao';
import { Vertex } from '@/engine/core/data/vertex';
import { RenderContext } from '@/engine/core/render-context';
import { Mat4 } from '@/engine/math/matrix/mat4';
import { Vec2 } from '@/engine/math/vector/vec2';
import { Vec3 } from '@/engine/math/vector/vec3';
import Vec4 from '@/engine/math/vector/vec4';

/** 顶点着色器 */
export class VertexRotateShader {
  /**
   * 主函数
   * @param context - 渲染上下文、可以拿到各种矩阵、事件、纹理等、和游戏引擎类似了
   * @param vertex - 顶点数据
   * @param vertexOut - 顶点着色器输出
   */
  main(context: RenderContext, inputVAO: VAO, vertexOut: Vertex): Vec4 {
    // 齐次坐标
    const coord = Vec4.fromArray([inputVAO.position[0], inputVAO.position[1], inputVAO.position[2], 1]);
    const time = context.time;
    // prettier-ignore
    const rotationMat = Mat4.fromValues(
        Math.cos(time), 0, -Math.sin(time), 0,
        0, 1, 0, 0,
        Math.sin(time), 0, Math.cos(time), 0,
        0, 0, 0, 1
    )
    // 应用旋转矩阵
    let position = rotationMat.multiply(coord);
    // 转化为顶点数据
    vertexOut.position = context.matWorld.multiply(position).xyz;
    vertexOut.normal = Vec3.fromArray([inputVAO.normal[0], inputVAO.normal[1], inputVAO.normal[2]]);
    vertexOut.uv = Vec2.fromArray([inputVAO.uv[0], inputVAO.uv[1]]);
    vertexOut.color = Vec4.fromArray([inputVAO.color[0], inputVAO.color[1], inputVAO.color[2], 1]);

    // 应用MVP变换、将顶点转化到 NDC裁剪空间内 【NDC裁剪空间：-1到1】
    position = context.matMVP.multiply(position);
    return position;
  }
}
