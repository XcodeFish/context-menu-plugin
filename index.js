import Vue3ContextMenu from './src/vue3';
import ReactContextMenu from './src/react';
import { autoDetectFramework, setErrorHandler } from './src/shared/utils';

// 主入口
const ContextMenuPlugin = {
  install(app, options = {}) {
    // 初始化错误处理器
    if (options.onError) {
      setErrorHandler(options.onError);
    }

    // 自动检测框架或使用指定的框架
    const framework = options.framework || autoDetectFramework();
    
    switch(framework) {
      case 'vue3':
        Vue3ContextMenu.install(app);
        break;
      case 'react':
        // React 不需要安装，直接导出组件和hook
        console.warn('React 版本不需要安装，请直接导入组件和hook使用');
        break;
      default:
        console.error(`不支持的框架: ${framework}`);
    }
  },
  
  // 导出各框架版本
  versions: {
    vue3: Vue3ContextMenu,
    react: ReactContextMenu
  }
};

export default ContextMenuPlugin;

// 导出Vue3版本
export const Vue3 = Vue3ContextMenu;

// 导出React版本
export const React = ReactContextMenu;
