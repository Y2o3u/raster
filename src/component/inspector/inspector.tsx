import React, { useState } from 'react';
import './inspector.scss';
import { Checkbox, Input, Select, Radio } from 'antd';
import * as SceneList from '../../examples';
import { RadioChangeEvent } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { FaceCulling, RasterizerMode } from '@/engine/pipeline/pipeline';
import { CameraMode } from '@/engine/core/camera';
const { Option } = Select;
/** 检查器组件的props */
interface InspectorProps {
  /** 初始场景 */
  initialScene: string | null;
  /** 初始分辨率 */
  initialResolution: { x: number; y: number };
  /** 分辨率变化 */
  onResolutionChange: (resolution: { x: number; y: number }) => void;
  /** 场景变化 */
  onSceneChange: (scene: string | null) => void;
  /** 渲染模式变化 */
  onRenderModeChange: (mode: RasterizerMode) => void;
  /** 相机模式变化 */
  onCameraModeChange: (mode: CameraMode) => void;
  /** 是否开启MSAA抗锯齿 */
  onEnableMSAAChange: (enabled: boolean) => void;
  /** 面剔除变化 */
  onFaceCullingChange: (mode: FaceCulling) => void;
}

/** 检查器组件 */
function Inspector({
  initialScene,
  initialResolution,
  onResolutionChange,
  onSceneChange,
  onRenderModeChange,
  onCameraModeChange,
  onEnableMSAAChange,
  onFaceCullingChange,
}: InspectorProps) {
  // 属性
  const [resolution, setResolution] = useState(initialResolution);
  const [selectedScene, setSelectedScene] = useState(initialScene);

  const [renderMode, setRenderMode] = useState(RasterizerMode.Normal);
  const [cameraMode, setCameraMode] = useState(CameraMode.Perspective);
  const [isMSAAEnabled, setMSAA] = useState(false);
  const [faceCulling, setFaceCulling] = useState(FaceCulling.Back);
  /** 宽度变化 */
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResolution({ ...resolution, x: parseInt(e.target.value, 10) || 0 });
  };

  /** 高度变化 */
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResolution({ ...resolution, y: parseInt(e.target.value, 10) || 0 });
  };

  /** 分辨率变化 */
  const handleBlurOrEnter = (e: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
    if ('key' in e && e.key !== 'Enter') return;
    onResolutionChange(resolution);
  };

  /** 场景变化 */
  const handleSceneChange = (e: RadioChangeEvent) => {
    const newScene = e.target.value;
    setSelectedScene(newScene);
    onSceneChange(newScene);
  };

  const sceneKeys = Object.keys(SceneList);

  /** 渲染模式变化 */
  const handleRenderModeChange = (value: RasterizerMode) => {
    setRenderMode(value);
    onRenderModeChange(value);
  };

  /** 相机模式变化 */
  const handleCameraModeChange = (value: CameraMode) => {
    setCameraMode(value);
    onCameraModeChange(value);
  };

  /** 开关抗锯齿 */
  const handleMSAAChange = (e: CheckboxChangeEvent) => {
    setMSAA(e.target.checked);
    onEnableMSAAChange(e.target.checked);
  };

  /** 面剔除变化 */
  const handleFaceCullingChange = (value: FaceCulling) => {
    setFaceCulling(value);
    onFaceCullingChange(value);
  };

  return (
    <div className='Inspector'>
      <div className='resolution'>
        <label className='label'>分辨率:</label>
        <Input
          placeholder='width'
          value={resolution.x}
          onChange={handleWidthChange}
          onBlur={handleBlurOrEnter}
          onKeyPress={handleBlurOrEnter}
          className='input'
        />
        <Input
          placeholder='height'
          value={resolution.y}
          onChange={handleHeightChange}
          onBlur={handleBlurOrEnter}
          onKeyPress={handleBlurOrEnter}
          className='input'
        />
      </div>

      <div className='render-mode'>
        <div className='flex-center'>
          <label className='label'>渲染模式:</label>
          <Select defaultValue={RasterizerMode.Normal} className='select' onChange={handleRenderModeChange}>
            <Option value={RasterizerMode.Normal}>常规</Option>
            <Option value={RasterizerMode.Triangle}>三角形</Option>
            <Option value={RasterizerMode.Depth}>深度</Option>
          </Select>
        </div>
      </div>

      <div className='camera-mode'>
        <div className='flex-center'>
          <label className='label'>相机模式:</label>
          <Select defaultValue={CameraMode.Perspective} className='select' onChange={handleCameraModeChange}>
            <Option value={CameraMode.Perspective}>透视</Option>
            <Option value={CameraMode.Orthographic}>正交</Option>
          </Select>
        </div>
      </div>

      <div className='render-mode'>
        <div className='flex-center'>
          <label className='label'>面剔除:</label>
          <Select defaultValue={faceCulling} className='select' onChange={handleFaceCullingChange}>
            <Option value={FaceCulling.Back}>背面</Option>
            <Option value={FaceCulling.Front}>正面</Option>
            <Option value={FaceCulling.Off}>关闭</Option>
          </Select>
        </div>
      </div>

      <div className='msaa'>
        <div className='flex-center'>
          <label className='label'>抗锯齿(MSAA)</label>
          <Checkbox onChange={handleMSAAChange} />
          <label className='label'>（仅支持常规光栅）</label>
        </div>
      </div>

      <div className='scene-list'>
        <label className='scene-label'>场景列表:</label>
        <Radio.Group size='small' defaultValue={selectedScene} className='full-width' onChange={handleSceneChange}>
          {sceneKeys.map((sceneKey) => (
            <Radio key={sceneKey} value={sceneKey} className='scene-radio'>
              {SceneList[sceneKey].introduce}
            </Radio>
          ))}
        </Radio.Group>
      </div>
    </div>
  );
}

export default Inspector;
