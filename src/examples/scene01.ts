import { Camera, CameraMode } from '@/engine/core/camera';
import { Material } from '@/engine/core/material';
import { Node } from '@/engine/core/node';
import { Scene } from '@/engine/core/scene';
import { Primitives } from '@/engine/geometry/primitives';
import { Vec3 } from '@/engine/math/vector/vec3';
import { VertexRotateShader } from '@/engine/shader/vertex/vertex-rotate-shader';

/** 渲染三角形 */
export class Scene01 extends Scene {
  /** 场景描述 */
  static introduce = '光栅化三角形';

  /** 是否展示MSAA开关 */
  static isShowMSAA = true;

  /** 初始化场景 */
  init(width: number, height: number) {
    this.camera = new Camera(width, height, -1, -100, 90);
    this.camera.setMode(CameraMode.Perspective);

    // 原本相机应该放在0，0，0、看向0，0，-1。为了三角形少填一个z，所以设置为 0，0，-1。效果一样
    this.camera.setPosition(0, 0, 2);
    this.camera.lookAt(new Vec3(0, 0, 0));

    /** 三角形节点 */
    const triangle = new Node();
    /** 设置顶点数据 */
    triangle.setVBO(Primitives.triangle(), 3, 0, 3, 0, 0);

    const material = triangle.getMaterial();
    material.setVertexShader(new VertexRotateShader());
    triangle.setMaterial(material);

    triangle.setPosition(new Vec3(0, 0, -0.1));
    // triangle.setRotation(new Vec3(0, 0, 0));
    // 设置shader、通常在材质上
    this.addChild(triangle);
  }
}
