import React, { useState } from 'react';
import './App.scss';
import { FaceCulling, RasterizerMode } from './engine/pipeline/pipeline';
import Inspector from './component/inspector/inspector';
import * as SceneList from './examples';
import { CameraMode } from './engine/core/camera';
import Renderer from './component/render-comp';

/** 默认场景 */
const DefaultScene = SceneList.Scene05;

function App() {
  const [resolution, setResolution] = useState({ x: 800, y: 600 });
  const [sceneKey, setSceneKey] = useState<string | null>(DefaultScene.name);
  const [renderMode, setRenderMode] = useState(RasterizerMode.Normal);
  const [cameraMode, setCameraMode] = useState(CameraMode.Perspective);
  const [faceCulling, setFaceCulling] = useState(FaceCulling.Back);
  const [isMSAAEnabled, setMSAA] = useState(false);

  /** 分辨率变化 */
  function handleResolutionChange(newResolution: { x: number; y: number }) {
    // 变化了才更新
    if (newResolution.x !== resolution.x || newResolution.y !== resolution.y) {
      setResolution(newResolution);
    }
  }

  /** 场景切换 */
  function handleSceneChange(newScene: string | null) {
    setSceneKey(newScene);
  }

  /** 是否开启MSAA抗锯齿 */
  function handleEnableMSAA(enabled: boolean): void {
    setMSAA(enabled);
  }

  /** 相机模式变化 */
  function handleCameraModeChange(mode: CameraMode): void {
    setCameraMode(mode);
  }

  /** 光栅化模式变化 */
  function handleRenderModeChange(mode: RasterizerMode): void {
    setRenderMode(mode);
  }

  /** 面剔除变化 */
  function handleFaceCullingChange(mode: FaceCulling): void {
    setFaceCulling(mode);
  }

  return (
    <>
      <div className='container'>
        <div className='canvas-container'>
          <canvas id='canvas' width={resolution.x} height={resolution.y} />
          <span id='fps' className='fps'>
            FPS: 0
          </span>
          <Renderer
            resolution={resolution}
            sceneKey={sceneKey}
            renderMode={renderMode}
            cameraMode={cameraMode}
            isMSAAEnabled={isMSAAEnabled}
            faceCulling={faceCulling}
          />
        </div>
        <div className='sidebar'>
          <Inspector
            initialScene={sceneKey}
            initialResolution={resolution}
            onResolutionChange={handleResolutionChange}
            onSceneChange={handleSceneChange}
            onRenderModeChange={handleRenderModeChange}
            onCameraModeChange={handleCameraModeChange}
            onEnableMSAAChange={handleEnableMSAA}
            onFaceCullingChange={handleFaceCullingChange}
          />
        </div>
      </div>
    </>
  );
}

export default App;
