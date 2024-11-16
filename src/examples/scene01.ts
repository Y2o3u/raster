import { Camera, CameraMode } from '@/engine/core/camera';
import { Node } from '@/engine/core/node';
import { Scene } from '@/engine/core/scene';
import { Primitives } from '@/engine/geometry/primitives';
import { Vec3 } from '@/engine/math/vector/vec3';
import { FragmentShader } from '@/engine/shader/fragment/fragment-shader';
import { VertexShader } from '@/engine/shader/vertext/vertex-shader';

class Grid {
  private lines: Vec3[];

  constructor(size: number, step: number) {
    this.lines = [];
    for (let i = -size; i <= size; i += step) {
      // 水平线
      this.lines.push(new Vec3(-size, 0, i));
      this.lines.push(new Vec3(size, 0, i));
      // 垂直线
      this.lines.push(new Vec3(i, 0, -size));
      this.lines.push(new Vec3(i, 0, size));
    }
  }

  getLines() {
    return this.lines;
  }
}

function createGridNode(size: number, step: number): Node {
  const grid = new Grid(size, step);
  const node = new Node();
  const lines = grid.getLines();

  // 设置顶点缓冲
  node.setVBO(
    {
      position: lines.flatMap((line) => [line.x, line.y, line.z]),
      color: lines.flatMap(() => [0.5, 0.5, 0.5]), // 灰色
      uv: [],
      tangent: [],
      normal: [],
      indices: Array.from({ length: lines.length }, (_, i) => i),
    },
    3,
    0,
    3,
    0,
    0
  );

  // 设置着色器
  node.setShader(new VertexShader(), new FragmentShader());

  return node;
}

/** 渲染三角形 */
export class Scene01 extends Scene {
  constructor(width: number, height: number) {
    super();
    this.init(width, height);
  }

  /** 初始化场景 */
  init(width: number, height: number) {
    this.camera = new Camera(width, height, -0.1, -100, 90);
    this.camera.setMode(CameraMode.Orthographic);

    // 原本相机应该放在0，0，0、看向0，0，-1。为了三角形少填一个z，所以设置为 0，0，-1。效果一样
    this.camera.setPosition(0, 0, -1);
    this.camera.lookAt(new Vec3(0, 0, 0));

    // 在场景初始化时添加网格节点
    const gridNode = createGridNode(10, 1);
    this.addChild(gridNode);

    /** 三角形节点 */
    const triangle = new Node();
    /** 设置顶点数据 */
    triangle.setVBO(Primitives.triangle(), 3, 0, 3, 0, 0);
    // 设置shader、通常在材质上
    this.addChild(triangle);
  }
}
