import ContextMenu from './ContextMenu.vue';
import { createApp, h } from 'vue';
import { defaultMenuItems, createContextAwareHandler } from '../shared/utils';

// 处理剪贴板操作
const handleClipboardCopy = async (text) => {
  try {
    // 先尝试使用现代 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // 降级使用 execCommand
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      textArea.remove();
      return true;
    } catch (err) {
      console.error('复制失败:', err);
      textArea.remove();
      return false;
    }
  } catch (err) {
    console.error('剪贴板操作失败:', err);
    return false;
  }
};

// 构建右键菜单项
const buildMenuItems = (selectedText, customItems = [], contextAware = false) => {
  if (!selectedText) {
    return customItems.length > 0 ? customItems : defaultMenuItems;
  }

  return [
    {
      label: '复制',
      handler: async () => {
        const success = await handleClipboardCopy(selectedText);
        if (!success) {
          console.warn('复制操作可能需要用户授权或在安全上下文中运行');
        }
      }
    },
    {
      label: '搜索',
      handler: () => {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(selectedText)}`, '_blank');
      }
    },
    {
      label: '保存文本',
      handler: () => {
        const blob = new Blob([selectedText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'selected-text.txt';
        a.click();
        URL.revokeObjectURL(url);
      }
    },
    { type: 'separator' },
    ...customItems
  ];
};

export default {
  install(app) {
    // 注册组件
    app.component('ContextMenu', ContextMenu);

    // 创建一个全局的上下文菜单实例
    let menuInstance = null;

    // 创建包装div
    const wrapper = document.createElement('div');
    wrapper.id = 'global-context-menu-container';
    document.body.appendChild(wrapper);

    // 创建独立的Vue应用实例
    const contextMenuApp = createApp({
      render() {
        return h(ContextMenu, {
          ref: 'contextMenuRef'
        });
      }
    });

    const vm = contextMenuApp.mount(wrapper);
    menuInstance = vm.$refs.contextMenuRef;

    // 注册指令
    app.directive('contextmenu', {
      mounted(el, binding) {
        // 确保元素可以接收右键事件
        el.style.userSelect = 'text';
        el.style.webkitUserSelect = 'text';
        el.style.cursor = 'context-menu';

        const handleContextMenu = (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          const { items = [], theme = 'light', position = {}, contextAware = false } = binding.value || {};
          const selectedText = window.getSelection().toString().trim();

          if (contextAware) {
            const contextHandler = createContextAwareHandler((event, contextItems, config) => {
              menuInstance?.show(event, contextItems, { ...config, theme });
            });
            contextHandler(e);
            return;
          }

          const menuItems = buildMenuItems(selectedText, items, contextAware);
          
          menuInstance?.show(e, menuItems, {
            ...position,
            theme,
            useElementPosition: false
          });
        };

        el._handleContextMenu = handleContextMenu;
        el.addEventListener('contextmenu', handleContextMenu);
      },
      
      unmounted(el) {
        if (el._handleContextMenu) {
          el.removeEventListener('contextmenu', el._handleContextMenu);
          el._handleContextMenu = null;
        }
      }
    });

    // 将实例添加到全局属性中，方便访问
    app.config.globalProperties.$contextMenu = menuInstance;
  }
};
