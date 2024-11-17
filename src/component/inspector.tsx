import React from 'react';
import './inspector.scss';
import { Button, Checkbox, Input, Radio, Select } from 'antd';

const { Option } = Select;

/**
 * 检查器面板
 * @param resolution 分辨率
 * @returns
 */
function Inspector(resolution: { x: number; y: number }) {
  return (
    <div className='Inspector' style={{ textAlign: 'left' }}>
      {/* 分辨率、宽高设置、分别对应输入框（样式占一行、不超出屏幕） */}
      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <label style={{ marginRight: '5px', flex: 1 }}>分辨率</label>
        <Input placeholder='width' style={{ flex: 1, height: '20px', marginRight: '5px' }} />
        <Input placeholder='height' style={{ flex: 1, height: '20px', marginRight: '5px' }} />
      </div>

      {/* 渲染模式 */}
      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ marginRight: '5px' }}>光栅化模式:</label>
          <Select defaultValue='normal' style={{ height: '20px', width: '120px' }}>
            <Option value='high'>普通</Option>
            <Option value='normal'>三角形</Option>
            <Option value='ultra'>深度</Option>
          </Select>
        </div>
      </div>

      {/* 相机模式 */}
      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ marginRight: '5px' }}>相机模式:</label>
          <Select defaultValue='perspective' style={{ height: '20px', width: '120px' }}>
            <Option value='perspective'>透视</Option>
            <Option value='orthographic'>正交</Option>
          </Select>
        </div>
      </div>

      {/* 开启MSAA */}
      <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ marginRight: '5px' }}>抗锯齿(MSAA):</label>
          <Checkbox />
        </div>
      </div>
    </div>
  );
}

export default Inspector;
