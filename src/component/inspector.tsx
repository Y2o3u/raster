import React, { useState } from 'react';
import './inspector.scss';
import { Button, Checkbox, Input, Select } from 'antd';
import * as SceneList from '../examples';

const { Option } = Select;

function chunkArray(array: any[], size: number) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

function Inspector({
  initialResolution,
  onResolutionChange,
}: {
  initialResolution: { x: number; y: number };
  onResolutionChange: (resolution: { x: number; y: number }) => void;
}) {
  const [resolution, setResolution] = useState(initialResolution);

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResolution({ ...resolution, x: parseInt(e.target.value, 10) || 0 });
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResolution({ ...resolution, y: parseInt(e.target.value, 10) || 0 });
  };

  const handleBlurOrEnter = (e: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
    if ('key' in e && e.key !== 'Enter') return;
    onResolutionChange(resolution);
  };

  const sceneChunks = chunkArray(Object.keys(SceneList), 3);

  return (
    <div className='Inspector'>
      <div className='resolution'>
        <label className='label'>分辨率</label>
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
          <label className='label'>光栅化模式:</label>
          <Select defaultValue='normal' className='select'>
            <Option value='high'>普通</Option>
            <Option value='normal'>三角形</Option>
            <Option value='ultra'>深度</Option>
          </Select>
        </div>
      </div>

      <div className='camera-mode'>
        <div className='flex-center'>
          <label className='label'>相机模式:</label>
          <Select defaultValue='perspective' className='select'>
            <Option value='perspective'>透视</Option>
            <Option value='orthographic'>正交</Option>
          </Select>
        </div>
      </div>

      <div className='msaa'>
        <div className='flex-center'>
          <label className='label'>抗锯齿(MSAA):</label>
          <Checkbox />
        </div>
      </div>

      <div className='scene-list'>
        <label className='scene-label'>场景列表:</label>
        {sceneChunks.map((chunk, index) => (
          <div key={index} className='scene-group'>
            {chunk.map((sceneKey) => (
              <Button key={sceneKey} size='small' className='scene-button'>
                {sceneKey}
              </Button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Inspector;
