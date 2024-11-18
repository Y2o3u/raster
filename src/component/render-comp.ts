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
    /** 加载场景 */
    const loadScene = async () => {
      // 取消上一次的动画帧
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
      // 创建场景
      const scene = new SceneList[sceneKey as keyof typeof SceneList](resolution.x, resolution.y);
      // 异步初始化场景
      await scene.initAsync(resolution.x, resolution.y);
      // 设置相机模式
      scene.camera.setMode(cameraMode);
      // 渲染场景
      render(scene);
    };
    loadScene();
  }, [resolution, sceneKey, cameraMode, isMSAAEnabled, renderMode]);

  function render(scene: Scene) {
    // 创建渲染管线、及初始化
    const canvas = new WebCanvas('canvas');
    // 创建渲染管线
    const pipeline = new Pipeline(resolution.x, resolution.y);
    // 设置抗锯齿
    pipeline.setEnableMSAA(isMSAAEnabled);
    // 设置渲染模式
    pipeline.setRenderMode(renderMode);

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
    const sphereLight = scene.getSphereLight();

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
    // 球光位置、颜色
    if (sphereLight) {
      renderContext.sphereLightPos = sphereLight.position.xyz;
      renderContext.sphereLightColor = sphereLight.color;
    }

    // 遍历场景所有节点、填充FrameBuffer
    for (let i = 0; i < scene.size(); ++i) {
      let node = scene.getChild(i);
      renderContext.matWorld = node.matWorld;
      renderContext.matWorldIT = node.matWorldIT;
      // 计算MVP矩阵
      renderContext.matMVP = renderContext.matProjection.multiply(renderContext.matView).multiply(node.matWorld);
      // 节点材质数据
      const material = node.getMaterial();
      renderContext.vs = material.getVertexShader();
      renderContext.fs = material.getFragmentShader();
      renderContext.textures[0] = material.getTexture();
      // 渲染节点
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
