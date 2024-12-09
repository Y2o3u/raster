import { Shader } from '../shader/shader';
import { Texture } from './data/texture';

/**
 * 材质、存放着色器
 */
export class Material {
  /** 着色器 */
  shader: Shader;
  /** 纹理 */
  private textures: Texture[] = [];

  /**
   * @param vs - 顶点着色器
   * @param fs - 片元着色器
   */
  constructor(shader?: Shader) {
    this.shader = shader ?? new Shader();
  }

  /** 设置顶点着色器 */
  setShader(shader: Shader) {
    this.shader = shader;
  }

  /** 获取着色器 */
  getShader() {
    return this.shader;
  }

  /** 设置纹理 */
  setTexture(texture: Texture, index = 0) {
    this.textures[index] = texture;
  }

  /** 获取纹理 */
  getTextures() {
    return this.textures;
  }
}
