import { Camera } from './camera';
import { Node } from './node';
import { SphereLight } from './sphere-light';

/** 场景 */
export class Scene {
  /** 相机 */
  camera: Camera;
  /** 球形光源 */
  sphereLight: SphereLight;
  /** 子节点 */
  children: Node[];

  constructor() {
    this.children = [];
    this.sphereLight = new SphereLight();
    this.camera = new Camera();
  }

  /** 添加子节点 */
  addChild(node: Node) {
    this.children.push(node);
  }

  /** 获取子节点数量 */
  size() {
    return this.children.length;
  }

  /** 获取子节点 */
  getChild(index: number) {
    return this.children[index];
  }

  /** 获取相机 */
  getCamera() {
    return this.camera;
  }

  /** 获取球形光源 */
  getSphereLight() {
    return this.sphereLight;
  }

  /** 清空场景 */
  clear() {
    this.children = [];
  }
}
