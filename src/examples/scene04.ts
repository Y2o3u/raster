import { Camera, CameraMode } from '@/engine/core/camera';
import { Texture } from '@/engine/core/data/texture';
import { Node, RotationAxis } from '@/engine/core/node';
import { Scene } from '@/engine/core/scene';
import { Loader } from '@/engine/math/utils/file-loader';
import { ObjParse } from '@/engine/math/utils/obj-parser';
import { Vec3 } from '@/engine/math/vector/vec3';
import { FragmentTextureShader } from '@/engine/shader/fragment/fragment-texture-shader';
import { VertexRotateShader } from '@/engine/shader/vertext/vertex-rotate-shader';
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

    // 初始化场景
    // const spotObj = await Loader.loadText(Obj.AfricanHead);
    // const vertex = ObjParse.convertToVAO(spotObj);
    // const texture = await Loader.loadImg(Png.AfricanHead);

    const spotObj = await Loader.loadText(Obj.Spot);
    const vertex = ObjParse.convertToVAO(spotObj);
    const texture = await Loader.loadImg(Png.Spot);

    // 创建节点
    const spot = new Node();
    spot.setVBO(vertex, 3, 2, 3, 3, 0);
    spot.setRotationAxis(RotationAxis.X, 30);
    spot.vs = new VertexRotateShader();
    spot.fs = new FragmentTextureShader();
    spot.setTexture(new Texture(texture));
    this.addChild(spot);
  }
}
