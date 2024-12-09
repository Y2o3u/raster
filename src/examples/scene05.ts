import { Camera, CameraMode } from '@/engine/core/camera';
import { Texture } from '@/engine/core/data/texture';
import { Material } from '@/engine/core/material';
import { Node } from '@/engine/core/node';
import { PointLight } from '@/engine/core/point-light';
import { Scene } from '@/engine/core/scene';
import { Loader } from '@/engine/math/utils/file-loader';
import { ObjParse } from '@/engine/math/utils/obj-parser';
import { Vec3 } from '@/engine/math/vector/vec3';
import Vec4 from '@/engine/math/vector/vec4';
import { LightModelRotateFragmentLevel } from '@/engine/shader/light-model-rotate-fragment-level';
import { LightModelVertexLevel } from '@/engine/shader/light-model-vertex-level';
import { Obj, Png } from '@/resources/resources';

/** 场景05、光照模型 */
export class Scene05 extends Scene {
  static introduce = '光照模型 (Blinn-Phong)';

  /**
   * 初始化场景
   * @param width - 宽度
   * @param height - 高度
   */
  async initAsync(width: number, height: number) {
    this.camera = new Camera(width, height, -1, -100, 90);
    this.camera.setMode(CameraMode.Perspective);

    this.camera.setPosition(0, 0, 2);
    this.camera.lookAt(new Vec3(0, 0, 0));

    // 创建一个点光源
    this.pointLight = new PointLight();
    this.pointLight.setPosition(new Vec3(0, 2, 2));
    this.pointLight.color = new Vec4(1, 1, 1, 1);

    // 加载奶牛模型
    const spotObj = await Loader.loadText(Obj.Spot);
    const vertex = ObjParse.convertToVAO(spotObj);
    const texture = await Loader.loadImg(Png.Spot);

    // 创建节点
    const spot = new Node();
    spot.setVBO(vertex, 3, 2, 3, 3, 0);
    spot.setRotation(new Vec3(30, 50, 0));

    const material = new Material(new LightModelRotateFragmentLevel());
    spot.setMaterial(material);
    material.setTexture(new Texture(texture));
    this.addChild(spot);
  }
}
