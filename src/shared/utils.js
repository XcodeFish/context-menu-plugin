/**
 * 默认菜单项 - 简洁版，无图标和快捷键
 */
export const defaultMenuItems = [
  {
    label: '复制',
    handler: (e) => {
      try {
        // 使用现代的Clipboard API
        if (navigator.clipboard && window.isSecureContext) {
          // 获取选中的文本
          const selection = window.getSelection();
          const selectedText = selection.toString();

          if (selectedText) {
            navigator.clipboard.writeText(selectedText)
              .then(() => {
                console.log('文本已复制到剪贴板');
              })
              .catch(err => {
                console.error('复制失败:', err);
                // 回退到旧方法
                document.execCommand('copy');
              });
          } else {
            console.log('没有选中文本');
          }
        } else {
          // 回退到旧方法
          const selection = window.getSelection();
          if (selection.toString()) {
            document.execCommand('copy');
            console.log('使用execCommand复制文本');
          }
        }
      } catch (err) {
        console.error('复制失败:', err);
      }
    }
  },
  {
    label: '粘贴',
    handler: () => {
      try {
        // 使用现代的Clipboard API
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.readText()
            .then(text => {
              // 获取当前活动元素
              const activeElement = document.activeElement;

              // 检查是否是可编辑元素
              if (activeElement && (
                  activeElement.isContentEditable ||
                  activeElement.tagName === 'TEXTAREA' ||
                  activeElement.tagName === 'INPUT'
              )) {
                // 在光标位置插入文本
                const start = activeElement.selectionStart || 0;
                const end = activeElement.selectionEnd || 0;
                const value = activeElement.value || '';

                if (typeof activeElement.value !== 'undefined') {
                  // 对于input和textarea元素
                  activeElement.value = value.substring(0, start) + text + value.substring(end);
                  // 设置新的光标位置
                  activeElement.selectionStart = activeElement.selectionEnd = start + text.length;
                } else if (activeElement.isContentEditable) {
                  // 对于contenteditable元素
                  document.execCommand('insertText', false, text);
                }

                console.log('文本已粘贴');
              } else {
                alert('请先点击一个可编辑区域，然后再尝试粘贴');
              }
            })
            .catch(err => {
              console.error('粘贴失败:', err);
              alert('由于浏览器安全限制，粘贴功能可能需要用户手动操作 (Ctrl+V)');
              // 回退到旧方法
              document.execCommand('paste');
            });
        } else {
          // 回退到旧方法
          const result = document.execCommand('paste');
          if (!result) {
            alert('由于浏览器安全限制，粘贴功能可能需要用户手动操作 (Ctrl+V)');
          }
        }
      } catch (err) {
        console.error('粘贴失败:', err);
        alert('由于浏览器安全限制，粘贴功能可能需要用户手动操作 (Ctrl+V)');
      }
    }
  },
  {
    label: '保存为',
    handler: () => {
      try {
        // 获取选中的文本或整个页面内容
        const selection = window.getSelection();
        let content = selection.toString();

        // 如果没有选中文本，尝试获取当前活动元素的内容
        if (!content) {
          const activeElement = document.activeElement;
          if (activeElement && (
              activeElement.tagName === 'TEXTAREA' ||
              activeElement.tagName === 'INPUT' ||
              activeElement.isContentEditable
          )) {
            content = activeElement.value || activeElement.innerText || '';
          } else {
            // 如果没有选中文本且没有活动的可编辑元素，提示用户
            alert('请先选择要保存的文本内容');
            return;
          }
        }

        if (content) {
          // 创建一个Blob对象
          const blob = new Blob([content], { type: 'text/plain' });

          // 创建一个下载链接
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'download.txt'; // 默认文件名

          // 添加到文档并触发点击
          document.body.appendChild(a);
          a.click();

          // 清理
          setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }, 0);

          console.log('内容已保存');
        }
      } catch (err) {
        console.error('保存失败:', err);
        alert('保存失败: ' + err.message);
      }
    }
  },
  {
    label: '刷新',
    handler: (e) => {
      try {
        // 获取当前活动元素
        const activeElement = document.activeElement;

        // 如果当前活动元素是iframe，尝试刷新iframe内容
        if (activeElement && activeElement.tagName === 'IFRAME') {
          try {
            activeElement.contentWindow.location.reload();
            console.log('iframe已刷新');
            return;
          } catch (iframeErr) {
            console.warn('无法刷新iframe，将刷新整个页面:', iframeErr);
            // 如果无法刷新iframe，回退到刷新整个页面
          }
        }

        // 如果是在特定元素上右键点击，可以尝试只刷新该元素
        // 例如，如果是在图片上右键点击，可以只重新加载图片
        const target = document.elementFromPoint(
          typeof e?.clientX === 'number' ? e.clientX : 0,
          typeof e?.clientY === 'number' ? e.clientY : 0
        );

        if (target && target.tagName === 'IMG' && target.src) {
          const originalSrc = target.src;
          // 添加时间戳参数强制浏览器重新加载图片
          target.src = originalSrc.includes('?')
            ? originalSrc + '&_t=' + new Date().getTime()
            : originalSrc + '?_t=' + new Date().getTime();
          console.log('图片已刷新');
          return;
        }

        // 默认刷新整个页面
        window.location.reload();
        console.log('页面已刷新');
      } catch (err) {
        console.error('刷新失败:', err);
        alert('刷新失败: ' + err.message);
      }
    }
  }
];

/**
 * 计算上下文菜单的位置
 * @param {MouseEvent|Object} e - 鼠标事件对象或包含坐标的对象
 * @param {Object} menuSize - 菜单尺寸 { width, height }
 * @param {Object} config - 位置配置
 * @returns {Object} - 计算后的位置 { x, y }
 */
export function calculatePosition(e, menuSize, config = {}) {
  try {
    // 默认配置
    const defaultConfig = {
      boundary: true,
      offset: 5,
      placement: 'auto',
      fixed: null,
      calculate: null,
      useElementPosition: false
    };

    const mergedConfig = { ...defaultConfig, ...config };
    
    // 获取视口尺寸
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 确保菜单尺寸有效
    const menuWidth = menuSize?.width || 150;
    const menuHeight = menuSize?.height || 200;

    // 使用 clientX/clientY 来获取相对于视口的位置
    let x = e.clientX;
    let y = e.clientY;

    // 如果没有 clientX/clientY，回退到 pageX/pageY 减去滚动距离
    if (typeof x !== 'number' || typeof y !== 'number') {
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      x = (e.pageX || 0) - scrollX;
      y = (e.pageY || 0) - scrollY;
    }

    // 添加微小偏移，避免鼠标正好在菜单上
    x += 2;
    y += 2;

    // 边界检测
    if (mergedConfig.boundary) {
      // 右边界检测
      if (x + menuWidth > viewportWidth - mergedConfig.offset) {
        x = x - menuWidth;
        // 如果左边也超出了，就放在左边界
        if (x < mergedConfig.offset) {
          x = mergedConfig.offset;
        }
      }

      // 下边界检测
      if (y + menuHeight > viewportHeight - mergedConfig.offset) {
        y = y - menuHeight;
        // 如果上边也超出了，就放在上边界
        if (y < mergedConfig.offset) {
          y = mergedConfig.offset;
        }
      }

      // 确保不小于最小边界值
      x = Math.max(mergedConfig.offset, x);
      y = Math.max(mergedConfig.offset, y);
    }

    return {
      x: Math.round(x),
      y: Math.round(y)
    };
  } catch (err) {
    console.error('计算菜单位置时出错:', err);
    return { x: 0, y: 0 };
  }
}

/**
 * 自动检测框架
 * @returns {string} - 检测到的框架名称
 */
export function autoDetectFramework() {
  if (typeof window !== 'undefined') {
    if (window.Vue) return 'vue3';
    if (window.React) return 'react';
  }

  throw new Error('无法自动检测框架，请手动指定 framework 选项');
}

/**
 * 创建上下文感知菜单处理函数
 * @param {Function} showContextMenu - 显示上下文菜单的函数
 * @returns {Function} 上下文感知菜单处理函数
 */
export const createContextAwareHandler = (showContextMenu) => {
  return (e) => {
    // 阻止默认行为
    e.preventDefault();

    // 获取目标元素
    const target = e.target;

    // 根据元素类型生成不同的菜单项
    let contextItems = [];

    // 图片元素
    if (target.tagName === 'IMG') {
      contextItems = [
        { id: 1, label: '查看图片', onClick: () => window.open(target.src, '_blank') },
        { id: 2, label: '复制图片', onClick: () => {
          try {
            // 创建一个canvas元素
            const canvas = document.createElement('canvas');
            canvas.width = target.naturalWidth;
            canvas.height = target.naturalHeight;

            // 将图片绘制到canvas上
            const ctx = canvas.getContext('2d');
            ctx.drawImage(target, 0, 0);

            // 将canvas转换为blob并复制到剪贴板
            canvas.toBlob((blob) => {
              try {
                const item = new ClipboardItem({ 'image/png': blob });
                navigator.clipboard.write([item])
                  .catch(err => console.error('复制图片失败:', err));
              } catch (err) {
                console.error('创建ClipboardItem失败:', err);
                alert('您的浏览器不支持复制图片到剪贴板');
              }
            });
          } catch (err) {
            console.error('复制图片失败:', err);
          }
        }},
        { id: 3, label: '保存图片', onClick: () => {
          // 创建一个a元素并模拟点击下载
          const a = document.createElement('a');
          a.href = target.src;
          a.download = target.alt || 'image';
          a.click();
        }},
        { id: 4, type: 'separator' },
        { id: 5, label: '复制', onClick: () => document.execCommand('copy') },
        { id: 6, label: '刷新', onClick: () => window.location.reload() }
      ];
    }
    // 链接元素
    else if (target.tagName === 'A') {
      contextItems = [
        { id: 1, label: '在新标签页中打开', onClick: () => window.open(target.href, '_blank') },
        { id: 2, label: '复制链接地址', onClick: () => {
          navigator.clipboard.writeText(target.href)
            .catch(err => console.error('复制链接失败:', err));
        }},
        { id: 3, type: 'separator' },
        { id: 4, label: '复制', onClick: () => document.execCommand('copy') },
        { id: 5, label: '粘贴', onClick: () => document.execCommand('paste') },
        { id: 6, label: '保存为', onClick: () => {
          const text = window.getSelection().toString() || target.textContent;
          const blob = new Blob([text], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'selection.txt';
          a.click();
          URL.revokeObjectURL(url);
        }},
        { id: 7, label: '刷新', onClick: () => window.location.reload() }
      ];
    }
    // 输入框或文本区域
    else if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      contextItems = [
        { id: 1, label: '剪切', onClick: () => document.execCommand('cut') },
        { id: 2, label: '复制', onClick: () => document.execCommand('copy') },
        { id: 3, label: '粘贴', onClick: () => document.execCommand('paste') },
        { id: 4, label: '全选', onClick: () => target.select() },
        { id: 5, type: 'separator' },
        { id: 6, label: '保存为', onClick: () => {
          const text = target.value;
          const blob = new Blob([text], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'text.txt';
          a.click();
          URL.revokeObjectURL(url);
        }},
        { id: 7, label: '刷新', onClick: () => window.location.reload() }
      ];
    }
    // 有选中文本的情况
    else if (window.getSelection().toString()) {
      contextItems = [
        { id: 1, label: '复制', onClick: () => document.execCommand('copy') },
        { id: 2, label: '保存为', onClick: () => {
          const text = window.getSelection().toString();
          const blob = new Blob([text], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'selection.txt';
          a.click();
          URL.revokeObjectURL(url);
        }},
        { id: 3, type: 'separator' },
        { id: 4, label: '搜索', onClick: () => {
          const text = window.getSelection().toString();
          window.open(`https://www.google.com/search?q=${encodeURIComponent(text)}`, '_blank');
        }},
        { id: 5, label: '刷新', onClick: () => window.location.reload() }
      ];
    }
    // 默认情况
    else {
      contextItems = defaultMenuItems;
    }

    // 显示上下文菜单，确保使用鼠标位置
    showContextMenu(e, contextItems, { useElementPosition: false });
  };
};

// 添加防抖工具函数
export const debounce = (fn, delay = 300) => {
  let timer = null
  return function(...args) {
    if(timer) clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// 菜单错误类
export class MenuError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
    this.name = 'MenuError'
  }
}

// 错误码定义
export const ErrorCodes = {
  FRAMEWORK_NOT_DETECTED: 'CM001',
  INVALID_MENU_ITEMS: 'CM002', 
  POSITION_CALC_FAILED: 'CM003',
  CLIPBOARD_ERROR: 'CM004',
  DOM_ERROR: 'CM005'
}

// 全局错误处理器
let globalErrorHandler = null;

// 设置全局错误处理器
export function setErrorHandler(handler) {
  globalErrorHandler = handler;
}

// 统一错误处理
export function handleError(err, silent = false) {
  const error = err instanceof MenuError 
    ? { code: err.code, message: err.message }
    : { code: 'CM999', message: err.message || '未知错误' };

  if (!silent) {
    if (globalErrorHandler) {
      // 使用自定义错误处理
      globalErrorHandler(error);
    } else {
      // 默认错误处理
      console.error(`[${error.code}] ${error.message}`);
      alert(error.message);
    }
  }

  return error;
}
