import { CameraMode } from '@/engine/core/camera';
import { Scene } from '@/engine/core/scene';
import scheduler from '@/engine/core/schedule';
import { RasterizerMode, Pipeline } from '@/engine/pipeline/pipeline';
import { WebCanvas } from '@/engine/platform/h5-canvas';
import { useRef, useEffect } from 'react';
import * as SceneList from '../examples';

/** 渲染器组件的props */
interface RendererProps {
  /** 分辨率 */
  resolution: { x: number; y: number };
  /** 场景key */
  sceneKey: string | null;
  /** 渲染模式 */
  renderMode: RasterizerMode;
  /** 相机模式 */
  cameraMode: CameraMode;
  /** 是否开启MSAA抗锯齿 */
  isMSAAEnabled: boolean;
}

/** 渲染器组件 */
const Renderer: React.FC<RendererProps> = ({ resolution, sceneKey, renderMode, cameraMode, isMSAAEnabled }) => {
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
    }
    const scene = new SceneList[sceneKey as keyof typeof SceneList](resolution.x, resolution.y);
    scene.camera.setMode(cameraMode);
    render(scene);
  }, [resolution, sceneKey, cameraMode, isMSAAEnabled, renderMode]);

  function render(scene: Scene) {
    // 创建渲染管线、及初始化
    const canvas = new WebCanvas('canvas');
    const pipeline = new Pipeline(resolution.x, resolution.y);
    pipeline.setEnableMSAA(isMSAAEnabled);
    pipeline.setRenderMode(renderMode);

    const fpsUpdater = updateFPS();

    // 主循环
    function mainLoop() {
      pipeline.clear();
      scheduler.update();
      renderScene(scene, pipeline);
      fpsUpdater();
      canvas.render(pipeline.getFrameBuffer());
      animationFrameId.current = requestAnimationFrame(mainLoop);
    }
    mainLoop();
  }

  /** 渲染场景 */
  function renderScene(scene: Scene, pipeline: Pipeline) {
    const camera = scene.getCamera();
    const sphereLight = scene.getSphereLight();

    // 设置渲染上下文、用于着色器
    const renderContext = pipeline.renderContext;
    renderContext.matView = camera.matView;
    renderContext.matViewport = camera.matViewport;
    renderContext.matOrtho = camera.matOrtho;
    renderContext.matProjection = camera.matProjection;
    renderContext.time = scheduler.getTotalTime();
    renderContext.cameraPos = camera.getPosition().xyz;
    if (sphereLight) {
      renderContext.sphereLightPos = sphereLight.position.xyz;
      renderContext.sphereLightColor = sphereLight.color;
    }

    // 遍历场景所有节点
    for (let i = 0; i < scene.size(); ++i) {
      let node = scene.getChild(i);
      renderContext.matWorld = node.matWorld;
      renderContext.matWorldIT = node.matWorldIT;
      const matMvp = renderContext.matProjection.multiply(renderContext.matView).multiply(node.matWorld);
      renderContext.matMVP = matMvp;
      renderContext.vs = node.vs;
      renderContext.fs = node.fs;
      renderContext.textures[0] = node.texture;
      pipeline.renderNode(node);
    }
  }

  /** 更新FPS */
  function updateFPS() {
    let lastUpdate = 0;
    return function () {
      const now = Date.now();
      if (now - lastUpdate >= 100) {
        document.getElementById('fps').innerText = `FPS: ${scheduler.getFPS()}`;
        lastUpdate = now;
      }
    };
  }

  return null;
};

export default Renderer;
