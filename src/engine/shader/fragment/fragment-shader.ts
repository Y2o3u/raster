import { Vertex } from '@/engine/core/data/vertex';
import { RenderContext } from '@/engine/core/render-context';
import Vec4 from '@/engine/math/vector/vec4';

/** 片段着色器 */
export class FragmentShader {
  /**
   * 主函数
   * @param context - 渲染上下文
   * @param input - 顶点数据
   * @returns 颜色
   */
  main(context: RenderContext, input: Vertex): Vec4 {
    // 默认颜色
    let color = input.color || new Vec4(1, 1, 1, 1);
    // 存在纹理、则进行纹理采样
    const texture = context.getTexture(0);
    if (texture) {
      // 纹理采样
      color = texture.getColorByUV(input.uv.x, input.uv.y);
    }
    return color;
  }
}
