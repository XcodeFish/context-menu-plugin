import React, { useState } from 'react';
import { ContextMenu, useContextMenu, createContextAwareHandler } from '../../src/react';

function App() {
  // 主题状态
  const [theme, setTheme] = useState('light');

  // 使用自定义Hook，传递主题
  const {
    visible,
    position,
    items,
    showContextMenu,
    hideContextMenu,
    menuRef  // 获取menuRef
  } = useContextMenu({ theme });

  // 基本菜单项
  const menuItems = [
    { id: 1, label: '复制', onClick: () => alert('复制') },
    { id: 2, label: '粘贴', onClick: () => alert('粘贴') },
    { id: 3, label: '删除', onClick: () => alert('删除'), disabled: true }
  ];

  // 自定义菜单项
  const customMenuItems = [
    {
      id: 1,
      label: '编辑',
      children: [
        { id: 11, label: '剪切', onClick: () => alert('剪切') },
        { id: 12, label: '复制', onClick: () => alert('复制') },
        { id: 13, label: '粘贴', onClick: () => alert('粘贴') }
      ]
    },
    { id: 2, type: 'separator' },
    { id: 3, label: '刷新', onClick: () => alert('刷新') },
    { id: 4, label: '设置', onClick: () => alert('设置') }
  ];

  // 上下文感知菜单处理函数
  const handleContextAwareMenu = createContextAwareHandler(showContextMenu);

  // 切换主题
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // 位置配置
  const positionConfig = {
    boundary: true,
    offset: 15,
    placement: 'right'
  };

  return (
    <div className="app">
      <h1>React 右键菜单示例</h1>

      <div
        className="demo-area"
        onContextMenu={(e) => showContextMenu(e, menuItems)}
      >
        在此区域右键点击（自定义菜单项）
      </div>

      <div
        className="demo-area"
        onContextMenu={(e) => showContextMenu(e, customMenuItems, positionConfig)}
      >
        在此区域右键点击（自定义位置配置）
      </div>

      <div
        className="demo-area"
        onContextMenu={(e) => showContextMenu(e)}
      >
        在此区域右键点击（使用默认菜单项：复制、粘贴、保存为、刷新）
      </div>

      <div
        className="demo-area"
        onContextMenu={(e) => showContextMenu(e, [], { theme: 'dark' })}
      >
        在此区域右键点击（使用暗色主题）
      </div>

      <div
        className="demo-area"
        onContextMenu={handleContextAwareMenu}
      >
        在此区域右键点击（使用上下文感知菜单）
      </div>

      <div className="test-section">
        <h3>测试区域</h3>
        <p onContextMenu={(e) => showContextMenu(e)}>
          这是一段可以选中的文本，尝试选中后右键使用"复制"功能。
        </p>
        <textarea
          className="text-area"
          placeholder="在此输入文本，然后尝试右键菜单功能"
          onContextMenu={(e) => showContextMenu(e)}
        ></textarea>
        <p onContextMenu={(e) => showContextMenu(e)}>
          尝试在文本框中右键使用"粘贴"功能，或者选中文本后使用"保存为"功能。
        </p>

        <h3>上下文感知菜单测试</h3>
        <div className="context-aware-test">
          <img
            src="https://picsum.photos/300/200"
            alt="示例图片"
            onContextMenu={handleContextAwareMenu}
            className="test-image"
          />
          <p>
            在上面的图片上右键点击，将显示图片特定的菜单项。
            也可以在<a href="https://github.com" target="_blank" rel="noopener noreferrer" onContextMenu={handleContextAwareMenu}>这个链接</a>上右键点击，
            将显示链接特定的菜单项。
          </p>
        </div>

        <h3>主题切换测试</h3>
        <div className="theme-test">
          <button onClick={toggleTheme} className="theme-button">
            切换主题 (当前: {theme})
          </button>
          <div
            className={`theme-demo ${theme === 'dark' ? 'dark-bg' : ''}`}
            onContextMenu={(e) => showContextMenu(e, menuItems, { theme })}
          >
            在此区域右键点击，使用当前主题 ({theme})
          </div>
        </div>
      </div>

      {/* 渲染上下文菜单 */}
      <ContextMenu
        visible={visible}
        position={position}
        items={items}
        onClose={hideContextMenu}
        menuRef={menuRef}
        theme={theme}
      />
    </div>
  );
}

export default App;

// CSS样式
const styles = `
.app {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.demo-area {
  margin: 20px 0;
  padding: 40px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  text-align: center;
  cursor: context-menu;
}

.text-area {
  width: 100%;
  height: 100px;
  margin: 20px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

.test-section {
  margin: 30px 0;
  padding: 20px;
  background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 8px;
}

.test-section h3 {
  margin-top: 0;
  color: #333;
}

.test-section p {
  line-height: 1.6;
  margin: 15px 0;
}
`;

// 添加样式到页面
const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);
