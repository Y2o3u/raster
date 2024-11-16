import { Mat4 } from '../math/matrix/mat4';
import { VAO2VBO } from '../math/utils/util';
import { Vec3 } from '../math/vector/vec3';
import { FragmentShader } from '../shader/fragment/fragment-shader';
import { VertexShader } from '../shader/vertext/vertex-shader';
import { Texture } from './data/texture';
import { VAO } from './data/vao';
import { VBO } from './data/vbo';

/** 节点 */
export class Node {
  /** 位置信息 */
  position: Vec3;
  /** 缩放 */
  scale: Vec3;

  /** 顶点缓冲 */
  vertexBuffer: VBO;
  /** 索引缓冲 */
  indexBuffer: number[];

  /** 世界矩阵 */
  matWorld: Mat4;
  /** 世界矩阵的逆矩阵 */
  matWorldIT: Mat4;

  /** 理论上可以封装一层 material: Material 存放着色器 */
  /** 顶点着色器 */
  vs: VertexShader;
  /** 片元着色器 */
  fs: FragmentShader;

  /** 纹理 */
  texture: Texture;

  constructor() {
    this.matWorld = Mat4.identity();
    this.matWorldIT = Mat4.identity();

    this.position = new Vec3(0, 0, 0);
    this.scale = new Vec3(1, 1, 1);

    // 添加默认材质
    this.vs = new VertexShader();
    this.fs = new FragmentShader();
  }

  /** 更新世界矩阵 */
  updateWorldMatrix(): void {
    // prettier-ignore
    this.matWorld = Mat4.fromValues(
      this.scale.x, 0, 0, this.position.x,
      0, this.scale.y, 0, this.position.y,
      0, 0, this.scale.z, this.position.z,
      0, 0, 0, 1
    );
    // 更新逆矩阵
    this.matWorldIT = this.matWorld.invert();
  }

  /** 设置位置 */
  setPosition(position: Vec3): void {
    if (position.equals(this.position)) return;
    this.position = position;
    this.updateWorldMatrix();
  }

  /** 设置纹理 */
  setTexture(texture: Texture): void {
    this.texture = texture;
  }

  /** 设置缩放 */
  setScale(scale: Vec3): void {
    if (scale.equals(this.scale)) return;
    this.scale = scale;
    this.updateWorldMatrix();
  }

  /**
   * 设置顶点缓冲
   * @param vao - VAO
   * @param positionSize - 位置大小
   * @param uvSize - uv大小
   * @param colorSize - 颜色大小
   * @param normalSize - 法线大小
   * @param tangentSize - 切线大小
   */
  setVBO(
    vao: VAO,
    positionSize: number,
    uvSize: number,
    colorSize: number,
    normalSize: number,
    tangentSize: number
  ): void {
    this.vertexBuffer = VAO2VBO(vao, positionSize, uvSize, colorSize, normalSize, tangentSize);
    if (vao.indices) this.indexBuffer = vao.indices;
  }

  /** 设置索引缓冲 */
  setIndexBuffer(indexBuffer: number[]) {
    this.indexBuffer = indexBuffer;
  }

  /** 获取顶点缓冲 */
  getVertexBuffer() {
    return this.vertexBuffer;
  }

  /** 获取索引缓冲 */
  getIndicesBuffer() {
    return this.indexBuffer;
  }

  /** 设置着色器 */
  setShader(vs?: VertexShader, fs?: FragmentShader) {
    this.vs = vs;
    this.fs = fs;
  }
}
