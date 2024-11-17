import React, { useState } from 'react';
import './App.scss';
import { RasterizerMode } from './engine/pipeline/pipeline';
import Inspector from './component/inspector/inspector';
import * as SceneList from './examples';
import { CameraMode } from './engine/core/camera';
import Renderer from './component/render-comp';

function App() {
  const [resolution, setResolution] = useState({ x: 800, y: 600 });
  const [sceneKey, setSceneKey] = useState<string | null>(SceneList.Scene01.name);
  const [renderMode, setRenderMode] = useState(RasterizerMode.Normal);
  const [cameraMode, setCameraMode] = useState(CameraMode.Perspective);
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
    console.log('Scene changed:', newScene);
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
          />
        </div>
      </div>
    </>
  );
}

export default App;
