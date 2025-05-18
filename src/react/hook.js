import { useState, useCallback, useRef, useEffect } from 'react';
import { calculatePosition, defaultMenuItems } from '../shared/utils';


export function useContextMenu(options = {}) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [items, setItems] = useState([]);
  const [theme, setTheme] = useState(options.theme || 'light');
  // 使用 useState 来存储菜单尺寸，但初始值不重要，因为会在渲染后更新
  const [, setMenuSize] = useState({ width: 150, height: 200 });
  const menuRef = useRef(null);
  const eventRef = useRef(null);
  const positionConfigRef = useRef({});

  // 计算菜单尺寸和位置 - 使用两阶段计算
  useEffect(() => {
    if (visible && menuRef.current && eventRef.current) {
      // 使用requestAnimationFrame确保DOM已完全渲染
      requestAnimationFrame(() => {
        try {
          // 获取菜单的实际尺寸
          const rect = menuRef.current.getBoundingClientRect();

          // 确保尺寸有效
          if (rect.width > 0 && rect.height > 0) {
            const actualSize = {
              width: rect.width,
              height: rect.height
            };

            // 更新尺寸和位置
            setMenuSize(actualSize);

            // 强制使用鼠标位置，不使用元素位置
            positionConfigRef.current.useElementPosition = false;

            // 使用保存的事件数据重新计算位置
            const { x, y } = calculatePosition(eventRef.current, actualSize, positionConfigRef.current);
            setPosition({ x, y });

            // 输出调试信息
            console.log('最终菜单位置:', { x, y }, '菜单尺寸:', actualSize);
          }
        } catch (err) {
          console.error('计算菜单位置时出错:', err);
        }
      });
    }
  }, [visible]);

  // 显示上下文菜单 - 使用两阶段计算，支持上下文感知
  const showContextMenu = useCallback((e, menuItems, positionConfig = {}) => {
    // 阻止默认右键菜单（如果是事件对象）
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    // 创建一个包含原始事件坐标的对象，确保捕获所有可能的属性
    const eventData = e ? {
      // 客户端坐标（相对于视口）
      clientX: e.clientX,
      clientY: e.clientY,

      // 页面坐标（相对于文档）
      pageX: e.pageX || (e.clientX + window.pageXOffset),
      pageY: e.pageY || (e.clientY + window.pageYOffset),

      // 屏幕坐标（相对于屏幕）
      screenX: e.screenX,
      screenY: e.screenY,

      // 目标元素
      target: e.target,

      // 其他可能有用的属性
      altKey: e.altKey,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      metaKey: e.metaKey,
      button: e.button,

      // 空方法
      preventDefault: () => {}
    } : null;

    // 保存事件数据和配置，以便在useEffect中使用
    eventRef.current = eventData || e;

    // 处理配置
    const newConfig = {
      ...positionConfig,
      useElementPosition: false // 确保使用鼠标位置而不是元素位置
    };

    // 如果提供了主题，更新主题
    if (positionConfig.theme) {
      setTheme(positionConfig.theme);
    }

    positionConfigRef.current = newConfig;

    // 确定要显示的菜单项
    let itemsToShow;

    // 如果启用了上下文感知，使用默认菜单项
    if (positionConfig.contextAware && e && e.target) {
      itemsToShow = defaultMenuItems;
    }
    // 如果没有提供菜单项或菜单项为空数组，使用默认菜单项
    else if (!menuItems || (Array.isArray(menuItems) && menuItems.length === 0)) {
      itemsToShow = defaultMenuItems;
    }
    // 否则使用提供的菜单项
    else {
      itemsToShow = menuItems;
    }

    // 设置菜单项
    setItems(itemsToShow);

    // 使用默认尺寸计算初始位置
    const defaultSize = { width: 150, height: 200 };

    // 强制使用鼠标位置，不使用元素位置
    newConfig.useElementPosition = false;

    const { x, y } = calculatePosition(eventData || e, defaultSize, newConfig);
    setPosition({ x, y });

    // 输出调试信息
    console.log('初始菜单位置:', { x, y }, '事件坐标:', eventData || e);

    // 显示菜单 - 实际尺寸和最终位置将在useEffect中计算
    setVisible(true);
  }, []);

  // 隐藏上下文菜单
  const hideContextMenu = useCallback(() => {
    setVisible(false);
  }, []);

  return {
    visible,
    position,
    items,
    theme,
    showContextMenu,
    hideContextMenu,
    menuRef
  };
}
