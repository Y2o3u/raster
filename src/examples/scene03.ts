import { Camera, CameraMode } from '@/engine/core/camera';
import { Texture } from '@/engine/core/data/texture';
import { Material } from '@/engine/core/material';
import { Node, RotationAxis } from '@/engine/core/node';
import { Scene } from '@/engine/core/scene';
import { Primitives } from '@/engine/geometry/primitives';
import { Loader } from '@/engine/math/utils/file-loader';
import { Vec3 } from '@/engine/math/vector/vec3';
import { FragmentTextureShader } from '@/engine/shader/fragment/fragment-texture-shader';
import { VertexRotateShader } from '@/engine/shader/vertext/vertex-rotate-shader';
import { Png } from '@/resources/resources';

/** 场景03、纹理渲染 */
export class Scene03 extends Scene {
  /** 场景描述 */
  static introduce = '纹理贴图';

  /** 初始化场景 */
  async initAsync(width: number, height: number) {
    // 初始化场景
    this.camera = new Camera(width, height, -1, -100, 90);
    this.camera.setMode(CameraMode.Perspective);

    // 设置相机位置
    this.camera.setPosition(0, 0, 2);
    this.camera.lookAt(new Vec3(0, 0, 0));

    // 创建立方体
    const cube = new Node();
    cube.setVBO(Primitives.cube(), 3, 2, 3, 0, 0);
    cube.setRotationAxis(RotationAxis.X, 30);

    // 加载纹理
    const spot = await Loader.loadImg(Png.Spot);
    cube.texture = new Texture(spot);

    // 创建一个新的材质
    const material = new Material(new VertexRotateShader(), new FragmentTextureShader());
    cube.setMaterial(material);

    this.addChild(cube);
  }
}
