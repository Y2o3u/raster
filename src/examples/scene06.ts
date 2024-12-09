import { Camera, CameraMode } from '@/engine/core/camera';
import { Texture } from '@/engine/core/data/texture';
import { Material } from '@/engine/core/material';
import { Node } from '@/engine/core/node';
import { PointLight } from '@/engine/core/point-light';
import { Scene } from '@/engine/core/scene';
import scheduler from '@/engine/core/schedule';
import { Primitives } from '@/engine/geometry/primitives';
import { Loader } from '@/engine/math/utils/file-loader';
import { ObjParse } from '@/engine/math/utils/obj-parser';
import { Vec3 } from '@/engine/math/vector/vec3';
import Vec4 from '@/engine/math/vector/vec4';
import { BumpTextureShader } from '@/engine/shader/bump-texture-shader';
import { LightModelFragmentLevel } from '@/engine/shader/light-model-fragment-level';
import { Obj, Png } from '@/resources/resources';

/** 场景06、法线贴图 */
export class Scene06 extends Scene {
  static introduce = '法线贴图';

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
    const wallDiffuse = await Loader.loadImg(Png.WallDiffuse);
    const wallNormal = await Loader.loadImg(Png.WallNormal);

    // 创建一个点光源
    this.pointLight = new PointLight();
    this.pointLight.setScale(0.1);
    const originPos = new Vec3(1.5, 1.5, 2);
    this.pointLight.setPosition(originPos);
    this.pointLight.setRotation(new Vec3(45, 0, 0));
    this.pointLight.color = new Vec4(1, 1, 1, 1);
    this.pointLight.setVBO(Primitives.triangle(), 3, 2, 0, 3, 0);
    this.addChild(this.pointLight);

    // 旋转光源
    this.interval(() => {
      // 使用世界矩阵、
      this.pointLight.setPosition(originPos.clone().rotateY(scheduler.getTotalTime() * 25));
      console.log('计时器运行');
    }, 0.1);

    // 创建球体
    const sphere = new Node();
    sphere.setVBO(sphereVertex, 3, 2, 0, 3, 0);
    sphere.setRotation(new Vec3(30, 0, 0));
    const material = new Material(new BumpTextureShader());
    material.setTexture(new Texture(wallDiffuse), 0);
    material.setTexture(new Texture(wallNormal), 1);
    sphere.setMaterial(material);
    this.addChild(sphere);

    // 创建地板
    const floor = new Node();
    const floorObj = await Loader.loadText(Obj.Plane);
    const floorVertex = ObjParse.convertToVAO(floorObj);
    floor.setVBO(floorVertex, 3, 2, 3, 3, 0);
    floor.setPosition(new Vec3(0, -1.5, 0));
    floor.setScale(new Vec3(3, 33, 3));
    const material1 = new Material(new LightModelFragmentLevel());
    floor.setMaterial(material1);
    this.addChild(floor);
  }
}
