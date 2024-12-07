import { Camera, CameraMode } from '@/engine/core/camera';
import { Texture } from '@/engine/core/data/texture';
import { Material } from '@/engine/core/material';
import { Node } from '@/engine/core/node';
import { Scene } from '@/engine/core/scene';
import { Loader } from '@/engine/math/utils/file-loader';
import { ObjParse } from '@/engine/math/utils/obj-parser';
import { Vec3 } from '@/engine/math/vector/vec3';
import { RotateSelfShader } from '@/engine/shader/rotate-self-shader';
import { Obj, Png } from '@/resources/resources';

/** 场景04、模型渲染 */
export class Scene04 extends Scene {
  /** 场景描述 */
  static introduce = '模型渲染';

  /** 初始化场景 */
  async initAsync(width: number, height: number) {
    this.camera = new Camera(width, height, -1, -100, 90);
    this.camera.setMode(CameraMode.Perspective);

    this.camera.setPosition(0, 0, 2);
    this.camera.lookAt(new Vec3(0, 0, 0));

    // 加载奶牛模型
    const spotObj = await Loader.loadText(Obj.Spot);
    const vertex = ObjParse.convertToVAO(spotObj);
    const texture = await Loader.loadImg(Png.Spot);

    // 创建节点
    const spot = new Node();
    spot.setVBO(vertex, 3, 2, 3, 3, 0);
    spot.setRotation(new Vec3(30, 50, 0));

    const material = new Material(new RotateSelfShader());
    spot.setMaterial(material);

    spot.setTexture(new Texture(texture));
    this.addChild(spot);
  }
}
