import { Camera, CameraMode } from '@/engine/core/camera';
import { Material } from '@/engine/core/material';
import { Node, RotationAxis } from '@/engine/core/node';
import { Scene } from '@/engine/core/scene';
import { Primitives } from '@/engine/geometry/primitives';
import { Vec3 } from '@/engine/math/vector/vec3';
import { VertexRotateShader } from '@/engine/shader/vertex/vertex-rotate-shader';

/** 场景二、立方体 */
export class Scene02 extends Scene {
  /** 场景描述 */
  static introduce = '立方体（背面剔除）';

  /** 是否展示MSAA开关 */
  static isShowMSAA = true;

  init(width: number, height: number) {
    // 初始化场景
    this.camera = new Camera(width, height, -1, -100, 90);
    this.camera.setMode(CameraMode.Perspective);

    this.camera.setPosition(0, 0, 2);
    this.camera.lookAt(new Vec3(0, 0, 0));

    // 立方体
    const cube = new Node();
    cube.setVBO(Primitives.cube(), 3, 0, 3, 0, 0);
    cube.setRotation(new Vec3(30, 0, 0));

    // 创建一个新的材质
    const material = new Material(new VertexRotateShader());
    cube.setMaterial(material);

    this.addChild(cube);
  }
}
