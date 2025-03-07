import { CameraMode } from '@/engine/core/camera';
import { Scene } from '@/engine/core/scene';
import scheduler from '@/engine/core/schedule';
import { RasterizerMode, Pipeline, FaceCulling } from '@/engine/pipeline/pipeline';
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
  /** 面剔除 */
  faceCulling: FaceCulling;
}

let lastScene: Scene | null = null;
/** 渲染器组件 */
const Renderer: React.FC<RendererProps> = ({
  resolution,
  sceneKey,
  renderMode,
  cameraMode,
  isMSAAEnabled,
  faceCulling,
}) => {
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    /** 加载场景 */
    const loadScene = async () => {
      // 创建场景
      const scene = new SceneList[sceneKey as keyof typeof SceneList](resolution.x, resolution.y);

      // 异步初始化场景
      await scene.initAsync(resolution.x, resolution.y);

      // 场景加载完、再取消、避免闪烁
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
      // 销毁上一个场景
      if (lastScene) lastScene.destroy();
      lastScene = scene;
      // 设置相机模式
      scene.camera.setMode(cameraMode);
      // 渲染场景
      render(scene);
    };

    loadScene();
  }, [resolution, sceneKey, cameraMode, isMSAAEnabled, renderMode, faceCulling]);

  function render(scene: Scene) {
    // 创建渲染管线、及初始化
    const canvas = new WebCanvas('canvas');
    // 创建渲染管线
    const pipeline = new Pipeline(resolution.x, resolution.y);
    // 设置抗锯齿
    pipeline.setEnableMSAA(isMSAAEnabled);
    // 设置渲染模式
    pipeline.setRenderMode(renderMode);
    // 设置面剔除
    pipeline.setFaceCulling(faceCulling);

    // 更新FPS
    const fpsUpdater = updateFPS();

    // 主循环
    function mainLoop() {
      // 清空渲染管线
      pipeline.clear();
      // 更新调度器
      scheduler.update();
      // 渲染场景
      renderScene(scene, pipeline);
      // 更新FPS
      fpsUpdater();
      // 渲染到canvas
      const frameBuffer = pipeline.getFrameBuffer();
      canvas.render(frameBuffer);
      // 请求下一帧
      animationFrameId.current = requestAnimationFrame(mainLoop);
    }
    mainLoop();
  }

  /** 渲染场景 */
  function renderScene(scene: Scene, pipeline: Pipeline) {
    const camera = scene.getCamera();
    const pointLight = scene.getPointLight();

    // 设置渲染上下文、用于着色器
    const renderContext = pipeline.renderContext;
    renderContext.matView = camera.matView;
    renderContext.matViewport = camera.matViewport;
    renderContext.matOrtho = camera.matOrtho;
    renderContext.matProjection = camera.matProjection;
    // 时间更新
    renderContext.time = scheduler.getTotalTime();
    // 相机位置
    renderContext.cameraPos = camera.getPosition().xyz;
    // 点光源位置、颜色
    if (pointLight) {
      renderContext.pointLightPos = pointLight.position;
      renderContext.pointLightColor = pointLight.color;
    }
    // 渲染场景
    scene.renderNodes(pipeline);
  }

  /** 更新FPS */
  function updateFPS() {
    let lastUpdate = 0;
    return function () {
      const now = Date.now();
      // 每100ms更新一次FPS
      if (now - lastUpdate >= 100) {
        document.getElementById('fps').innerText = `FPS: ${scheduler.getFPS()}`;
        lastUpdate = now;
      }
    };
  }

  return null;
};

export default Renderer;
