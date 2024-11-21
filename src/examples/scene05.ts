import { Camera, CameraMode } from '@/engine/core/camera';
import { Scene } from '@/engine/core/scene';
import { Vec3 } from '@/engine/math/vector/vec3';

/** 场景05、光照模型 */
export class Scene05 extends Scene {
  static introduce = '光照模型';

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
  }
}
