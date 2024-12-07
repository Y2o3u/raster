import { Mat4 } from '../math/matrix/mat4';
import { Vec3 } from '../math/vector/vec3';
import Vec4 from '../math/vector/vec4';
import { FragmentShader } from '../shader/fragment/fragment-shader';
import { VertexShader } from '../shader/vertex/vertex-shader';
import { Texture } from './data/texture';

/** 用于着色器的数据 */
export class RenderContext {
  /** 局部坐标系转世界坐标系 */
  matWorld: Mat4;
  /** 世界坐标系转局部坐标系 */
  matWorldIT: Mat4;

  /** 正交矩阵 */
  matOrtho: Mat4;
  /** 视口变换矩阵 */
  matViewport: Mat4;
  /** 视图变换矩阵 */
  matView: Mat4;
  /** 投影矩阵 */
  matProjection: Mat4;
  /** MVP变换矩阵 */
  matMVP: Mat4;
  /** 摄像机世界坐标 */
  cameraPos: Vec3;

  /** 点光源位置 */
  pointLightPos: Vec3;
  /** 点光源颜色 */
  pointLightColor: Vec4;

  /**
   * xy：屏幕尺寸
   * zw：屏幕尺寸倒数
   */
  screenSize: Vec4;

  /** 当前时间 */
  time: number;

  /** 顶点着色器 */
  vs: VertexShader;
  /** 片元着色器 */
  fs: FragmentShader;

  /**
   * 纹理数组
   */
  textures: Texture[];

  constructor() {
    this.textures = new Array(10); // 初始化10个纹理槽
  }

  /**
   * 获取纹理
   * @param index - 纹理索引
   * @returns 纹理
   */
  getTexture(index: number): Texture {
    return this.textures[index];
  }
}
