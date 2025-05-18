import React, { useRef, useEffect, useState } from 'react';
import '../styles/menu.scss';

const ContextMenu = ({
  items = [],
  position = { x: 0, y: 0 },
  visible = false,
  onClose,
  className = '',
  style = {},
  menuRef, // 接收从hook传递的ref
  theme = 'light'
}) => {
  // 如果没有传入menuRef，则创建一个本地ref
  const localMenuRef = useRef(null);
  // 使用传入的ref或本地ref
  const actualMenuRef = menuRef || localMenuRef;
  // 当前聚焦的菜单项索引
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // 处理点击外部关闭和键盘导航
  useEffect(() => {
    if (!visible) return;

    const handleClickOutside = (e) => {
      if (actualMenuRef.current && !actualMenuRef.current.contains(e.target)) {
        onClose && onClose();
      }
    };

    const handleKeyDown = (e) => {
      // 过滤掉分隔线
      const activeItems = items.filter(item => item.type !== 'separator');
      const itemCount = activeItems.length;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose && onClose();
          break;

        case 'ArrowDown':
          e.preventDefault();
          if (itemCount > 0) {
            setFocusedIndex(prev => (prev + 1) % itemCount);
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (itemCount > 0) {
            setFocusedIndex(prev => (prev - 1 + itemCount) % itemCount);
          }
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < itemCount) {
            const item = activeItems[focusedIndex];
            if (!item.disabled) {
              handleItemClick(item, e);
            }
          }
          break;
      }
    };

    // 添加事件监听
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    // 自动聚焦菜单
    if (actualMenuRef.current) {
      actualMenuRef.current.focus();
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      setFocusedIndex(-1);
    };
  }, [visible, onClose, actualMenuRef, items, focusedIndex]);

  // 处理点击菜单项
  const handleItemClick = (item, event) => {
    if (item.disabled) return;

    // 创建一个包含原始事件坐标的对象，确保捕获所有可能的属性
    const eventData = {
      // 客户端坐标（相对于视口）
      clientX: event?.clientX,
      clientY: event?.clientY,

      // 页面坐标（相对于文档）
      pageX: event?.pageX || (event?.clientX + window.pageXOffset),
      pageY: event?.pageY || (event?.clientY + window.pageYOffset),

      // 屏幕坐标（相对于屏幕）
      screenX: event?.screenX,
      screenY: event?.screenY,

      // 目标元素
      target: event?.target,

      // 其他可能有用的属性
      altKey: event?.altKey,
      ctrlKey: event?.ctrlKey,
      shiftKey: event?.shiftKey,
      metaKey: event?.metaKey,
      button: event?.button
    };

    // 支持两种回调函数名称：onClick 和 handler
    if (typeof item.onClick === 'function') {
      item.onClick(eventData);
    } else if (typeof item.handler === 'function') {
      item.handler(eventData);
    }

    onClose && onClose();
  };

  if (!visible) return null;

  return (
    <div
      ref={actualMenuRef}
      className={`context-menu cm-theme-${theme} ${className}`}
      style={{
        ...style,
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
      tabIndex={-1}
      role="menu"
      aria-orientation="vertical"
      onKeyDown={handleKeyDown}
      aria-label="上下文菜单"
    >
      {items.map((item, index) => {
        // 计算当前项在非分隔线项中的索引
        const activeItems = items.filter(i => i.type !== 'separator');
        const activeIndex = activeItems.indexOf(item);

        // 分隔线
        if (item.type === 'separator') {
          return <div key={`sep-${index}`} className="cm-separator" role="separator" />;
        }

        // 子菜单
        if (item.children && item.children.length > 0) {
          return (
            <div
              key={item.id || `item-${index}`}
              className={`cm-item cm-submenu ${item.disabled ? 'cm-disabled' : ''} ${activeIndex === focusedIndex ? 'cm-keyboard-focus' : ''}`}
              tabIndex={item.disabled ? -1 : 0}
              role="menuitem"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {item.icon && (
                <span className="cm-icon">
                  {item.icon}
                </span>
              )}
              <span className="cm-label">{item.label}</span>
              <span className="cm-submenu-arrow">
                &gt;
              </span>

              {/* 子菜单内容 */}
              <div className="cm-submenu-content">
                <div className={`context-menu cm-theme-${theme}`}>
                  {item.children.map((subItem, subIndex) => (
                    subItem.type === 'separator' ? (
                      <div key={`sub-sep-${subIndex}`} className="cm-separator" role="separator" />
                    ) : (
                      <div
                        key={subItem.id || `sub-item-${subIndex}`}
                        className={`cm-item ${subItem.disabled ? 'cm-disabled' : ''}`}
                        onClick={(event) => handleItemClick(subItem, event)}
                        tabIndex={subItem.disabled ? -1 : 0}
                        role="menuitem"
                        aria-label={subItem.label}
                      >
                        {subItem.icon && (
                          <span className="cm-icon">
                            {subItem.icon}
                          </span>
                        )}
                        <span className="cm-label">{subItem.label}</span>
                        {subItem.shortcut && (
                          <span className="cm-shortcut">{subItem.shortcut}</span>
                        )}
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          );
        }

        // 普通菜单项
        return (
          <div
            key={item.id || `item-${index}`}
            className={`cm-item ${item.disabled ? 'cm-disabled' : ''} ${activeIndex === focusedIndex ? 'cm-keyboard-focus' : ''}`}
            onClick={(event) => handleItemClick(item, event)}
            tabIndex={item.disabled ? -1 : 0}
            role="menuitem"
            aria-disabled={item.disabled}
            aria-label={item.label}
          >
            {item.icon && (
              <span className="cm-icon">
                {item.icon}
              </span>
            )}
            <span className="cm-label">{item.label}</span>
            {item.shortcut && (
              <span className="cm-shortcut">{item.shortcut}</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ContextMenu;
