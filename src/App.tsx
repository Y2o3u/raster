import React from 'react';
import './App.scss';

import { useEffect } from 'react';
import { Vec2 } from '@/engine/math/vector/vec2';
import { Scene } from './engine/core/scene';
import { Scene01 } from './examples/scene01';
import { WebCanvas } from './engine/platform/h5-canvas';
import { Scheduler } from './engine/core/schedule';
import { Scene02 } from './examples/scene02';
import { Mat4 } from './engine/math/matrix/mat4';
import { Pipeline, RasterizerMode } from './engine/pipeline/pipeline';
import Inspector from './component/inspector';
import { Layout } from 'antd';
import { Header, Content, Footer } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';

/** Canvas分辨率 */
const resolution = new Vec2(1334 / 2, 1000 / 2);
/** 全局计时器 */
const scheduler = new Scheduler();

/** 渲染 */
function render(scene: Scene) {
  // 初始化canvas、渲染管线
  const canvas = new WebCanvas('canvas');
  const pipeline = new Pipeline(resolution.x, resolution.y, RasterizerMode.Normal);

  // 渲染主循环
  function mainLoop() {
    // 清除帧缓冲
    pipeline.clear();
    // 更新计时器
    scheduler.update();
    // 渲染场景
    renderScene(scene, pipeline);

    // 获取最终的帧缓冲、渲染到canvas中
    canvas.render(pipeline.getFrameBuffer());
    requestAnimationFrame(mainLoop);
  }

  mainLoop();
}

/** 渲染场景 */
function renderScene(scene: Scene, pipeline: Pipeline) {
  // 获取相机、灯光
  const camera = scene.getCamera();
  const sphereLight = scene.getSphereLight();

  // 每次渲染设置一次
  const renderContext = pipeline.renderContext;
  renderContext.matView = camera.matView;
  renderContext.matViewport = camera.matViewport;
  renderContext.matOrtho = camera.matOrtho;
  renderContext.matProjection = camera.matProjection;

  // 将相关数据填充到renderContext中、主要用于着色器
  renderContext.time = scheduler.getTotalTime();
  renderContext.cameraPos = camera.getPosition().xyz;
  if (sphereLight) {
    renderContext.sphereLightPos = sphereLight.position.xyz;
    renderContext.sphereLightColor = sphereLight.color;
  }

  // 遍历场景中的所有节点、填充frameBuffer
  for (let i = 0; i < scene.size(); ++i) {
    let node = scene.getChild(i);
    renderContext.matWorld = node.matWorld;
    renderContext.matWorldIT = node.matWorldIT;
    // 计算MVP变换矩阵、从右到左
    const matMvp = renderContext.matProjection.multiply(renderContext.matView).multiply(node.matWorld);
    renderContext.matMVP = matMvp;
    renderContext.vs = node.vs;
    renderContext.fs = node.fs;
    renderContext.textures[0] = node.texture;
    pipeline.renderNode(node);
  }
}

function App() {
  // 获取场景、执行渲染
  // const scene = new Scene01(resolution.x, resolution.y);
  const scene = new Scene02(resolution.x, resolution.y);

  useEffect(() => {
    render(scene);
  }, []);

  return (
    <>
      <div className='container'>
        <div className='canvas-container'>
          <canvas id='canvas' width={resolution.x} height={resolution.y} />
        </div>
        <div className='sidebar'>
          <Inspector x={resolution.x} y={resolution.y} />
        </div>
      </div>
    </>
  );
}

export default App;
