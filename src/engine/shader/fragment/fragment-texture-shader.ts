import { RenderContext } from '@/engine/core/render-context';
import { FragmentShader } from './fragment-shader';
import { Vertex } from '@/engine/core/data/vertex';
import Vec4 from '@/engine/math/vector/vec4';

/** 片段着色器-纹理 */
export class FragmentTextureShader implements FragmentShader {
  /**
   * 主函数
   * @param renderContext - 渲染上下文
   * @param input - 顶点数据
   * @returns 颜色
   */
  main(renderContext: RenderContext, input: Vertex): Vec4 {
    const texture = renderContext.getTexture(0);
    if (!texture) {
      return new Vec4(1, 1, 1, 1);
    }
    // 纹理采样
    const color = texture.getColorByUV(input.uv.x, input.uv.y);
    return color;
  }
}
