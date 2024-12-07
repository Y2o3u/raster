import { Camera, CameraMode } from '@/engine/core/camera';
import { Texture } from '@/engine/core/data/texture';
import { Material } from '@/engine/core/material';
import { Node } from '@/engine/core/node';
import { PointLight } from '@/engine/core/point-light';
import { Scene } from '@/engine/core/scene';
import { Primitives } from '@/engine/geometry/primitives';
import { Loader } from '@/engine/math/utils/file-loader';
import { ObjParse } from '@/engine/math/utils/obj-parser';
import { Vec3 } from '@/engine/math/vector/vec3';
import Vec4 from '@/engine/math/vector/vec4';
import { FragmentLightShader } from '@/engine/shader/fragment/fragment-light-shader';
import { FragmentShader } from '@/engine/shader/fragment/fragment-shader';
import VertexLightShader from '@/engine/shader/vertex/vertex-light-shader';
import { VertexRotateShader } from '@/engine/shader/vertex/vertex-rotate-shader';
import { VertexShader } from '@/engine/shader/vertex/vertex-shader';
import { Obj, Png } from '@/resources/resources';

/** 场景05、光照模型 */
export class Scene06 extends Scene {
  static introduce = '球体';

  /**
   * 初始化场景
   * @param width - 宽度
   * @param height - 高度
   */
  async initAsync(width: number, height: number) {
    this.camera = new Camera(width, height, -1, -100, 90);
    this.camera.setMode(CameraMode.Perspective);

    this.camera.setPosition(0, 0, 4);
    this.camera.lookAt(new Vec3(0, 0, 0));

    // 加载球体模型
    const sphereObj = await Loader.loadText(Obj.Sphere);
    const sphereVertex = ObjParse.convertToVAO(sphereObj);

    // 创建一个点光源
    this.pointLight = new PointLight();
    // this.pointLight.setPosition(new Vec3(3, 1.5, 1));
    this.pointLight.setPosition(new Vec3(2, 2, 1));
    this.pointLight.setScale(0.1);
    this.pointLight.color = new Vec4(1, 1, 1, 1);
    this.pointLight.setVBO(sphereVertex, 3, 2, 0, 3, 0);
    this.addChild(this.pointLight);

    // 创建球体
    const sphere = new Node();
    sphere.setVBO(sphereVertex, 3, 2, 0, 3, 0);
    sphere.setRotation(new Vec3(30, 0, 0));
    const material = new Material(new VertexRotateShader(), new FragmentLightShader());
    sphere.setMaterial(material);
    this.addChild(sphere);

    // 创建地板
    const floor = new Node();
    const floorObj = await Loader.loadText(Obj.Plane);
    const floorVertex = ObjParse.convertToVAO(floorObj);
    floor.setVBO(floorVertex, 3, 2, 3, 3, 0);
    floor.setPosition(new Vec3(0, -1.5, 0));
    floor.setScale(new Vec3(3, 33, 3));
    const material1 = new Material(new VertexShader(), new FragmentLightShader());
    floor.setMaterial(material1);
    this.addChild(floor);
  }
}
