import { Mat4 } from '../math/matrix/mat4';
import { Vec3 } from '../math/vector/vec3';
import Vec4 from '../math/vector/vec4';

/** 相机 */
export class Camera {
  /** 位置 */
  private position: Vec4;
  /** 朝向 */
  private readonly direct: Vec3;
  /** 相机上方朝向 */
  private readonly up: Vec3;

  /** 是否透视视角 */
  private perspective: boolean = false;
  /** fov可视角 */
  private fov: number = 45;

  /** 相机分辨率 */
  private width: number;
  private height: number;

  /** 近平面n的距离 */
  private near: number;
  /** 远平面f的距离 */
  private far: number;

  /**
   * 屏幕坐标矩阵
   * 将标准的-1～1的矩阵、变化到屏幕大小的矩阵
   * 将宽/高, 由-1 ~ 1变成-w/2 ~ w/2和 h/2 ~ -h/2
   * 注意, 这里h相当于做了一次翻转
   */
  private viewportMat: Mat4;

  /**
   * 正交矩阵
   * 将rl, tb, nf，变化到-1～1的标准矩阵中
   */
  private matOrthographic: Mat4;

  /**
   * 观察矩阵
   * 将相摆放到 0，0，0 并且世界看向-z方向
   */
  private matView: Mat4;
  private matViewIT: Mat4;

  /** 透视矩阵 */
  private matProjection: Mat4;

  constructor(width: number, height: number, near: number, far: number, fov: number = 45) {
    this.position = new Vec4(0, 0, 0, 1);
    this.direct = new Vec3(0, 0, -1);
    this.up = new Vec3(0, 1, 0);
    this.width = width;
    this.height = height;
    this.near = near;
    this.far = far;
    this.fov = fov;

    this.calcMatViewportMat();
    this.calcMatProjection();
  }

  /** 设置位置 */
  setPosition(x: number, y: number, z: number) {
    this.position.set(x, y, z, 1);
    this.calcMatViewportMat();
    this.calcMatProjection();
    this.calcMatView();
  }

  /** 获取当前位置 */
  getPosition() {
    return this.position.clone();
  }

  /** 相机看相某个点 */
  lookAt(at: Vec3) {
    // 当前位置
    this.direct.fromVec3(this.position.xyz.sub(at));
    this.direct.normalize();
    this.calcMatView();
    this.calcMatProjection();
  }

  /** 使用透视模式 */
  public usePerspective(): this {
    this.perspective = true;
    return this;
  }

  /** 使用正交模式 */
  useOrthographic(): this {
    this.perspective = false;
    return this;
  }

  /** 是否是透视模式 */
  isPerspective() {
    return this.perspective;
  }

  /** 是否是正交模式 */
  isOrthographic() {
    return !this.perspective;
  }

  /** 获取观察矩阵 */
  get MatView() {
    return this.matView;
  }

  /** 获取视口转化矩阵 */
  get ViewportMat(): Mat4 {
    return this.viewportMat;
  }

  /**
   * 获取透视矩阵
   */
  get ProjectionMat(): Mat4 {
    return this.matProjection;
  }

  /** 计算屏幕矩阵 */
  calcMatView() {
    /**
     * 凝视方向g: this.direct
     * 向上方向t: this.up
     * 眼睛位置e: this.position.xyz
     * https://sites.cs.ucsb.edu/~lingqi/teaching/resources/GAMES101_Lecture_04.pdf
     *
     * w = -normalize(g)
     * u = normalize(t x w)
     * v = w x u
     */
    const w = this.direct.clone();
    const u = Vec3.cross(this.up, w).normalize();
    if (u.isZero()) {
      u.set(0, 0, 1);
    }

    const v = Vec3.cross(w, u);
    const matAngle = Mat4.fromValues(u.x, u.y, u.z, 0, v.x, v.y, v.z, 0, w.x, w.y, w.z, 0, 0, 0, 0, 1);
    // prettier-ignore
    const matMove = Mat4.fromValues(
      1, 0, 0, -this.position.x,
      0, 1, 0, -this.position.y,
      0, 0, 1, -this.position.z,
      0, 0, 0, 1
);
    this.matView = matAngle.multiply(matMove);
  }

  /**
   * 计算正交矩阵 / 正射投影视体
   * 将rl, tb, nf, 变换到-1 ~ 1的标准矩阵中
   * @private
   */
  calcMatOrthographic(): Mat4 {
    const t = Math.tan((this.fov * Math.PI) / 360) * Math.abs(this.near);
    const b = -t;
    const r = (this.width / this.height) * t;
    const l = -r;
    const n = this.near;
    const f = this.far;
    // prettier-ignore
    this.matOrthographic = Mat4.fromValues(
      2 / (r - l), 0, 0, -(r + l) / (r - l),
      0, 2 / (t - b), 0, -(t + b) / (t - b),
      0, 0, 2 / (n - f), -(n + f) / (n - f),
      0, 0, 0, 1
    );
    return this.matOrthographic;
  }

  /**
   * 获取正交矩阵 / 正射投影视体
   */
  getOrthographicMat(): Mat4 {
    return this.matOrthographic;
  }

  /**
   * 将标准-1~1的矩阵变换到屏幕大小的矩阵
   * 将宽/高, 由-1 ~ 1变成-w/2 ~ w/2和 h/2 ~ -h/2
   * 注意, 这里h相当于做了一次翻转
   */
  calcMatViewportMat(): void {
    const w = this.width;
    const h = this.height;
    // prettier-ignore
    this.viewportMat = Mat4.fromValues(
      w / 2, 0, 0, w / 2,
      0, -h / 2, 0, h / 2,
      0, 0, 1, 0,
      0, 0, 0, 1
    );
  }

  /**
   * 计算透视矩阵, 实现近大远小
   * @private
   */
  private calcMatProjection(): void {
    if (this.isOrthographic()) {
      this.matProjection = this.calcMatOrthographic();
      return;
    }

    const n = this.near;
    const f = this.far;
    // prettier-ignore
    this.matProjection = Mat4.fromValues(
      n, 0, 0, 0,
      0, n, 0, 0,
      0, 0, n + f, -f * n,
      0, 0, 1, 0
    );
  }
}
