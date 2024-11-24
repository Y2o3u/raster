import { Mat4 } from '../math/matrix/mat4';
import { VAO2VBO } from '../math/utils/util';
import { Vec3 } from '../math/vector/vec3';
import { FragmentShader } from '../shader/fragment/fragment-shader';
import { VertexShader } from '../shader/vertex/vertex-shader';
import { Texture } from './data/texture';
import { VAO } from './data/vao';
import { VBO } from './data/vbo';
import { Material } from './material';
import { Mesh } from './mesh';

/** 旋转轴枚举 */
export enum RotationAxis {
  X = 'x',
  Y = 'y',
  Z = 'z',
}

/** 节点 */
export class Node {
  /** 位置信息 */
  position: Vec3;
  /** 缩放 */
  scale: Vec3;
  /** 旋转 */
  rotation: Vec3;

  /** 网格 */
  mesh: Mesh;
  /** 材质 */
  material: Material;

  /** 世界矩阵 */
  matWorld: Mat4;
  /** 世界矩阵的逆矩阵 */
  matWorldIT: Mat4;

  constructor() {
    // 初始化世界矩阵
    this.matWorld = Mat4.identity();
    this.matWorldIT = Mat4.identity();

    // 初始化网格和材质
    this.mesh = new Mesh(null, []);
    this.material = new Material(new VertexShader(), new FragmentShader());

    // 初始化位置、缩放、旋转
    this.position = new Vec3(0, 0, 0);
    this.scale = new Vec3(1, 1, 1);
    this.rotation = new Vec3(0, 0, 0);
  }

  /** 更新世界矩阵 */
  updateWorldMatrix(): void {
    // prettier-ignore
    const matMove = Mat4.fromValues(
      1, 0, 0, this.position.x,
      0, 1, 0, this.position.y,
      0, 0, 1, this.position.z,
      0, 0, 0, 1
    );
    // prettier-ignore
    const matScale = Mat4.fromValues(
      this.scale.x, 0, 0, 0,
      0, this.scale.y, 0, 0,
      0, 0, this.scale.z, 0,
      0, 0, 0, 1
    );

    // prettier-ignore
    const matMoveIT = Mat4.fromValues(
      1, 0, 0, -this.position.x,
      0, 1, 0, -this.position.y,
      0, 0, 1, -this.position.z,
      0, 0, 0, 1
    );

    // prettier-ignore
    const matScaleIT = Mat4.fromValues(
      1 / this.scale.x, 0, 0, 0,
      0, 1 / this.scale.y, 0, 0,
      0, 0, 1 / this.scale.z, 0,
      0, 0, 0, 1
    );

    // 添加旋转矩阵
    const matRotateX = Mat4.rotationX(this.rotation.x);
    const matRotateY = Mat4.rotationY(this.rotation.y);
    const matRotateZ = Mat4.rotationZ(this.rotation.z);
    const matRotate = matRotateX.mul(matRotateY).mul(matRotateZ);
    // 旋转矩阵的逆、等于旋转矩阵的转置
    const matRotateIT = matRotate.transpose();

    this.matWorld = matMove.mul(matRotate).mul(matScale);
    this.matWorldIT = matScaleIT.mul(matRotateIT).mul(matMoveIT);
  }

  /** 设置位置 */
  setPosition(position: Vec3): void {
    if (position.equals(this.position)) return;
    this.position = position;
    this.updateWorldMatrix();
  }

  /** 设置旋转 */
  setRotation(rotation: Vec3): void {
    if (rotation.equals(this.rotation)) return;
    this.rotation = rotation;
    this.updateWorldMatrix();
  }

  /** 设置纹理 */
  setTexture(texture: Texture): void {
    this.material.setTexture(texture);
  }

  /** 设置缩放 */
  setScale(scale: Vec3): void {
    if (scale.equals(this.scale)) return;
    this.scale = scale;
    this.updateWorldMatrix();
  }

  /** 获取材质 */
  getMaterial(): Material {
    return this.material;
  }

  /** 设置材质 */
  setMaterial(material: Material): void {
    this.material = material;
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
    const vertexBuffer = VAO2VBO(vao, positionSize, uvSize, colorSize, normalSize, tangentSize);
    this.mesh.setVertexBuffer(vertexBuffer);
    if (vao.indices) this.mesh.setIndexBuffer(vao.indices);
  }

  /** 获取顶点缓冲 */
  getVertexBuffer() {
    return this.mesh.getVertexBuffer();
  }

  /** 获取索引缓冲 */
  getIndicesBuffer() {
    return this.mesh.getIndexBuffer();
  }
}
