import { useEffect } from 'react';
import { Vec2 } from '@/engine/math/vector/vec2';
import './render-comp.scss';
import React from 'react';
import Vec4 from '@/engine/math/vector/vec4';
import { Vec3 } from '@/engine/math/vector/vec3';
import { Vertex } from '@/engine/core/data/vertex';
import { RasterizerNormal } from '@/engine/rasterizer/rasterizer-normal';
import { Mat4 } from '@/engine/math/matrix/mat4';

// 三角形世界坐标
const point1 = new Vec4(-0.5, -0.5, 0, 1);
const point2 = new Vec4(0.5, -0.5, 0, 1);
const point3 = new Vec4(0, 0.5, 0, 1);

let rotation = 10;

const resolution = new Vec2(1000, 750);

/** 执行 */
function run() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  //创建imagedata，宽高可以和canvas保持一致
  const imageData = ctx.createImageData(resolution.x, resolution.y);

  // 执行一次渲染
  const renderOnce = function () {
    rotation = 0;
    // 世界坐标转换矩阵、缩放平移 (model transform)
    const matWorld = getWorldMatrix(new Vec3(1, 1, 1), new Vec3(0, 0, 0));
    // 视图变换 （view transform）、设置相机位置
    const matView = getViewMatrix(new Vec3(0, 1, 0), new Vec3(0, 0, 1), new Vec3(0, 0, 0));

    const isOrtho = true;
    // 正交投影矩阵 （ projection transform）
    const matOrtho = getOrthoMatrix(resolution.x, resolution.y, -1, -100, 40);
    // 透视投影矩阵
    const matPerspective = getPerspectiveMatrix(resolution.x, resolution.y, -1, -100);
    const projectionMatrix = isOrtho ? matOrtho : matPerspective;
    // 视口矩阵 (viewport transform)
    const matViewport = getViewPortMatrix(resolution.x, resolution.y);

    const vmvp = matViewport.multiply(projectionMatrix).multiply(matView).multiply(matWorld);
    let screenPos1 = vmvp.multiply(point1);
    let screenPos2 = vmvp.multiply(point2);
    let screenPos3 = vmvp.multiply(point3);

    // 光栅化器
    // let rasterizer = new RasterizerTriangle(400, 300);
    let rasterizer = new RasterizerNormal(resolution.x, resolution.y);

    // 生成帧缓冲
    const frameBuffer = rasterizer.getFrameBuffer();
    rasterizer.clear();

    const Vertex1 = new Vertex();
    Vertex1.color = new Vec4(1, 0, 0, 1);
    Vertex1.position = screenPos1.xyz;
    const Vertex2 = new Vertex();
    Vertex2.color = new Vec4(0, 1, 0, 1);
    Vertex2.position = screenPos1.xyz;
    const Vertex3 = new Vertex();
    Vertex3.color = new Vec4(0, 0, 1, 1);
    Vertex3.position = screenPos1.xyz;

    rasterizer.run(screenPos1, screenPos2, screenPos3, Vertex1, Vertex2, Vertex3);

    let len = frameBuffer.length;
    for (let i = 0; i < len; ++i) {
      imageData.data[i] = frameBuffer[i] * 255;
    }

    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(renderOnce);
  };

  renderOnce();
}

/** 获取旋转矩阵 */
function getRotateXMatriX(angle: number): Mat4 {
  const radian = (angle / 180) * Math.PI;
  // prettier-ignore
  const mat4 = Mat4.fromValues(
    Math.cos(radian), 0, Math.sin(radian), 0,
    0, 1, 0, 0,
    -Math.sin(radian), 0, Math.cos(radian), 0,
    0, 0, 0, 1
  );
  return mat4;
}

/** 获取视口转化矩阵 */
function getViewPortMatrix(width: number, height: number): Mat4 {
  // prettier-ignore
  const mat4 = Mat4.fromValues(
    width / 2, 0, 0, width / 2,
    0, -height / 2, 0, height / 2,
    0, 0, 1, 0,
    0, 0, 0, 1
  );
  return mat4;
}

/** 获取世界坐标矩阵 */
function getWorldMatrix(scale: Vec3, position: Vec3): Mat4 {
  // 旋转矩阵、绕x、y、z轴、或任意轴。
  // 缩放矩阵
  const matScale = Mat4.fromValues(scale.x, 0, 0, 0, 0, scale.y, 0, 0, 0, 0, scale.z, 0, 0, 0, 0, 1);
  // 平移矩阵
  const matMove = Mat4.fromValues(1, 0, 0, position.x, 0, 1, 0, position.y, 0, 0, 1, position.z, 0, 0, 0, 1);
  const matRotate = getRotationMatrix(new Vec3(0, 1, 0), rotation);
  // 先 缩放or旋转 再平移
  // 顺序只要记住缩放、旋转（线性变换）只能在原点进行。
  return matMove.multiply(matScale).multiply(matRotate);
}

/** 视图变换矩阵 */
function getViewMatrix(up: Vec3, position: Vec3, lookAt: Vec3): Mat4 {
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

  const direction = position.sub(lookAt);
  const w = direction.normalize();
  const u = Vec3.cross(up, w).normalize();
  const v = Vec3.cross(w, u);
  // prettier-ignore
  const mat4 = Mat4.fromValues(
    u.x, u.y, u.z, -position.x,
    v.x, v.y, v.z, -position.y,
    w.x, w.y, w.z, -position.z,
    0, 0, 0, 1
  );
  return mat4;
}

/** 获取正交矩阵 */
function getOrthoMatrix(width: number, height: number, near: number, far: number, fov: number): Mat4 {
  // tan(fov/2) = t/n
  const t = Math.tan(((fov / 180) * Math.PI) / 2) * Math.abs(near);
  const b = -t;
  const n = near;
  const f = far;
  // r/t = width/height
  const r = (width / height) * t;
  const l = -r;

  // prettier-ignore
  const mat4 = Mat4.fromValues(
    2 / (r - l), 0, 0, -(r + l) / (r - l),
    0, 2 / (t - b), 0, -(t + b) / (t - b),
    0, 0, 2 / (f - n), 0,
    0, 0, -(f + n) / (f - n), 1
  );
  return mat4;
}

/** 获取透视投影矩阵 */
function getPerspectiveMatrix(width: number, height: number, near: number, far: number): Mat4 {
  const n = near;
  const f = far;
  // prettier-ignore
  const mat4_perspective_orthr = Mat4.fromValues(
    n, 0, 0, 0, 
    0, n, 0, 0,
    0, 0, n + f, -n * f,
    0, 0, 1, 0
  );
  const mat4_ortho = getOrthoMatrix(width, height, near, far, 90);
  const mat4 = mat4_ortho.multiply(mat4_perspective_orthr);
  return mat4;
}

/** 获取绕任意轴旋转的矩阵 */
function getRotationMatrix(axis: Vec3, angle: number): Mat4 {
  // 角度转弧度
  const radian = (angle / 180) * Math.PI;
  const sinTheta = Math.sin(radian);
  const cosTheta = Math.cos(radian);
  const oneMinusCosTheta = 1 - cosTheta;

  const kx = axis.x;
  const ky = axis.y;
  const kz = axis.z;

  // 计算反对称矩阵K的元素
  const kxy = ky * kx * oneMinusCosTheta;
  const kxz = kz * kx * oneMinusCosTheta;
  const kyz = ky * kz * oneMinusCosTheta;

  const kxSinTheta = kx * sinTheta;
  const kySinTheta = ky * sinTheta;
  const kzSinTheta = kz * sinTheta;

  // 旋转矩阵
  // prettier-ignore
  const mat4 = Mat4.fromValues(
    cosTheta + kx * kx * oneMinusCosTheta, kxy - kzSinTheta, kxz + kySinTheta, 0,
    kxy + kzSinTheta, cosTheta + ky * ky * oneMinusCosTheta, kyz - kxSinTheta, 0,
    kyz - kxSinTheta, kxz - kySinTheta, cosTheta + kz * kz * oneMinusCosTheta, 0,
    0, 0, 0, 1  
  );

  return mat4;
}

/** 渲染组件 */
export default function RenderComp() {
  useEffect(() => {
    run();
  }, []);

  return (
    <div className='container'>
      <div className='canvas-container'>
        <canvas id='canvas' width={resolution.x} height={resolution.y} />
      </div>
      <div className='sidebar'>
        <button>操作1</button>
        <button>操作2</button>
        <button>操作3</button>
      </div>
    </div>
  );
}
