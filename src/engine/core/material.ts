import { FragmentShader } from '../shader/fragment/fragment-shader';
import { VertexShader } from '../shader/vertext/vertex-shader';
import { Texture } from './data/texture';

/**
 * 材质、存放着色器
 */
export class Material {
  /** 顶点着色器 */
  private vs: VertexShader;
  /** 片元着色器 */
  private fs: FragmentShader;
  /** 纹理 */
  private texture: Texture;

  /**
   * @param vs - 顶点着色器
   * @param fs - 片元着色器
   */
  constructor(vs?: VertexShader, fs?: FragmentShader) {
    // 默认顶点着色器
    this.vs = vs ?? new VertexShader();
    // 默认片元着色器
    this.fs = fs ?? new FragmentShader();
  }

  /** 获取顶点着色器 */
  getVertexShader() {
    return this.vs;
  }

  /** 获取片元着色器 */
  getFragmentShader() {
    return this.fs;
  }

  /** 设置顶点着色器 */
  setVertexShader(vs: VertexShader) {
    this.vs = vs;
  }

  /** 设置片元着色器 */
  setFragmentShader(fs: FragmentShader) {
    this.fs = fs;
  }

  /** 设置纹理 */
  setTexture(texture: Texture) {
    this.texture = texture;
  }

  /** 获取纹理 */
  getTexture() {
    return this.texture;
  }
}
