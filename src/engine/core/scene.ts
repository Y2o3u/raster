import { Camera } from './camera';
import { Node } from './node';
import { PointLight } from './point-light';

/** 场景 */
export class Scene {
  /** 相机 */
  camera: Camera;
  /** 点光源 */
  pointLight: PointLight;
  /** 子节点 */
  children: Node[];

  /** 是否展示MSAA开关 */
  static isShowMSAA = false;

  /** 可销毁对象 */
  disposables: { dispose: () => void }[] = [];

  constructor(width: number, height: number) {
    this.children = [];
    this.pointLight = new PointLight();
    this.camera = new Camera(width, height, -0.1, -100, 90);
    this.init(width, height);
  }

  /** 初始化场景 */
  init(width: number, height: number) {}

  /** 异步初始化场景 */
  initAsync(width: number, height: number) {}

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
  getPointLight() {
    return this.pointLight;
  }

  /** 清空场景 */
  clear() {
    this.children = [];
  }

  /**
   * 开启一个定时器
   * @param cb
   * @param interval 秒
   * @returns
   */
  interval(cb: () => void, interval: number, context = this) {
    let id = setInterval(cb.bind(context), interval * 1000);
    let disposeObj = {
      dispose() {
        clearInterval(id);
      },
    };
    this.disposables.push(disposeObj);
    return disposeObj;
  }

  /** 销毁 */
  destroy() {
    this.disposables.forEach((disposable) => disposable.dispose());
    this.disposables = [];
  }
}
