/**
 * 上下文感知菜单 - 根据右键点击的元素类型自动调整菜单项
 */

// 导入默认菜单项和错误处理
import { defaultMenuItems, handleError } from './utils';

/**
 * 获取图片特定的菜单项
 * @param {HTMLImageElement} imgElement - 图片元素
 * @returns {Array} - 图片特定的菜单项
 */
const getImageMenuItems = (imgElement) => {
  return [
    {
      label: '复制图片',
      icon: 'copy',
      handler: async () => {
        try {
          // 尝试使用现代API复制图片
          if (navigator.clipboard && navigator.clipboard.write) {
            const response = await fetch(imgElement.src);
            const blob = await response.blob();
            await navigator.clipboard.write([
              new ClipboardItem({
                [blob.type]: blob
              })
            ]);
            console.log('图片已复制到剪贴板');
          } else {
            // 回退方法：创建一个canvas并复制
            const canvas = document.createElement('canvas');
            canvas.width = imgElement.naturalWidth;
            canvas.height = imgElement.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(imgElement, 0, 0);
            canvas.toBlob((blob) => {
              const item = new ClipboardItem({ 'image/png': blob });
              navigator.clipboard.write([item]);
            });
          }
        } catch (err) {
          console.error('复制图片失败:', err);
          handleError({ code: 'CM006', message: '复制图片失败: ' + err.message });
        }
      }
    },
    {
      label: '保存图片',
      icon: 'download',
      handler: () => {
        try {
          const a = document.createElement('a');
          a.href = imgElement.src;
          a.download = imgElement.alt || 'image';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } catch (err) {
          console.error('保存图片失败:', err);
          handleError({ code: 'CM007', message: '保存图片失败: ' + err.message });
        }
      }
    },
    {
      label: '在新标签页中打开图片',
      icon: 'external-link-alt',
      handler: () => {
        try {
          window.open(imgElement.src, '_blank');
        } catch (err) {
          console.error('打开图片失败:', err);
          handleError({ code: 'CM008', message: '打开图片失败: ' + err.message });
        }
      }
    },
    {
      type: 'separator'
    },
    ...defaultMenuItems
  ];
};

/**
 * 获取链接特定的菜单项
 * @param {HTMLAnchorElement} linkElement - 链接元素
 * @returns {Array} - 链接特定的菜单项
 */
const getLinkMenuItems = (linkElement) => {
  return [
    {
      label: '在新标签页中打开',
      icon: 'external-link-alt',
      onClick: () => {
        try {
          window.open(linkElement.href, '_blank');
        } catch (err) {
          console.error('打开链接失败:', err);
          handleError({ code: 'CM009', message: '打开链接失败: ' + err.message });
        }
      }
    },
    {
      label: '复制链接地址',
      icon: 'link',
      onClick: () => {
        try {
          navigator.clipboard.writeText(linkElement.href)
            .then(() => {
              console.log('链接已复制到剪贴板');
            })
            .catch(err => {
              // 回退到旧方法
              const textarea = document.createElement('textarea');
              textarea.value = linkElement.href;
              document.body.appendChild(textarea);
              textarea.select();
              document.execCommand('copy');
              document.body.removeChild(textarea);
            });
        } catch (err) {
          console.error('复制链接失败:', err);
          handleError({ code: 'CM010', message: '复制链接失败: ' + err.message });
        }
      }
    },
    {
      type: 'separator'
    },
    ...defaultMenuItems
  ];
};

/**
 * 获取输入框特定的菜单项
 * @param {HTMLInputElement|HTMLTextAreaElement} inputElement - 输入框元素
 * @returns {Array} - 输入框特定的菜单项
 */
const getInputMenuItems = (inputElement) => {
  return [
    ...defaultMenuItems,
    {
      type: 'separator'
    },
    {
      label: '清空',
      icon: 'trash',
      handler: () => {
        try {
          inputElement.value = '';
          // 触发input事件，确保绑定的事件处理器能够感知到变化
          const event = new Event('input', { bubbles: true });
          inputElement.dispatchEvent(event);
        } catch (err) {
          console.error('清空输入框失败:', err);
          handleError({ code: 'CM011', message: '清空输入框失败: ' + err.message });
        }
      }
    }
  ];
};

/**
 * 根据目标元素获取上下文感知菜单项
 * @param {HTMLElement} target - 目标元素
 * @returns {Array} - 上下文感知菜单项
 */
export const getContextAwareMenuItems = (target) => {
  if (!target) return defaultMenuItems;

  // 检查是否是图片
  if (target.tagName === 'IMG') {
    return getImageMenuItems(target);
  }

  // 检查是否是链接
  if (target.tagName === 'A' && target.href) {
    return getLinkMenuItems(target);
  }

  // 检查是否是输入框或文本区域
  if (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.isContentEditable
  ) {
    return getInputMenuItems(target);
  }

  // 默认菜单项
  return defaultMenuItems;
};

/**
 * 创建上下文感知菜单处理函数
 * @param {Function} showContextMenu - 显示上下文菜单的函数
 * @returns {Function} - 上下文感知菜单处理函数
 */
export const createContextAwareHandler = (showContextMenu) => {
  return (e) => {
    e.preventDefault();

    // 获取目标元素
    const target = e.target;

    // 获取上下文感知菜单项
    const menuItems = getContextAwareMenuItems(target);

    // 显示菜单，确保使用鼠标位置
    showContextMenu(e, menuItems, { useElementPosition: false });
  };
};
