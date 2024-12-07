import { VAO } from '@/engine/core/data/vao';
import { Vertex } from '@/engine/core/data/vertex';
import { RenderContext } from '@/engine/core/render-context';
import { Vec2 } from '@/engine/math/vector/vec2';
import { Vec3 } from '@/engine/math/vector/vec3';
import Vec4 from '@/engine/math/vector/vec4';

/** 顶点着色器 */
export class VertexShader {
  /** 默认颜色 */
  defaultColor = new Vec4(1, 1, 1, 1);

  /**
   * 主函数
   * @param context - 渲染上下文、可以拿到各种矩阵、事件、纹理等、和游戏引擎类似了
   * @param vertex - 顶点数据
   * @param vertexOut - 顶点着色器输出
   */
  main(context: RenderContext, inputVAO: VAO, vertexOut: Vertex): Vec4 {
    // 齐次坐标
    const coord = Vec4.fromArray([inputVAO.position[0], inputVAO.position[1], inputVAO.position[2], 1]);
    // 应用节点的世界坐标变换矩阵、计算出世界坐标、uv等
    vertexOut.position = context.matWorld.mul(coord).xyz;
    // 法线变换
    const normal = context.matWorldIT.mul(
      Vec4.fromArray([inputVAO.normal[0], inputVAO.normal[1], inputVAO.normal[2], 0])
    ).xyz;
    vertexOut.normal = Vec4.fromArray([inputVAO.normal[0], inputVAO.normal[1], inputVAO.normal[2], 0]).xyz;
    vertexOut.uv = Vec2.fromArray([inputVAO.uv[0], inputVAO.uv[1]]);

    vertexOut.color = Vec4.fromArray([inputVAO.color[0], inputVAO.color[1], inputVAO.color[2], 1]);
    // 如果不存在颜色、则使用默认颜色
    if (isNaN(inputVAO.color[0])) {
      vertexOut.color = Vec4.fromArray([this.defaultColor.x, this.defaultColor.y, this.defaultColor.z, 1]);
    }

    // 如果存在纹理、采样纹理颜色
    if (context.getTexture(0)) {
      vertexOut.color = context.getTexture(0).getColorByUV(vertexOut.uv.x, vertexOut.uv.y, vertexOut.color);
    }

    //计算经过MVP变换后的坐标
    const position = context.matMVP.mul(coord);
    return position;
  }
}
