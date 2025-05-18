// 菜单项类型定义
export interface MenuItem {
  id?: string | number;
  label: string;
  type?: 'normal' | 'separator';
  icon?: string | React.ReactNode;
  disabled?: boolean;
  shortcut?: string;
  children?: MenuItem[];
  handler?: (e: MenuEvent) => void;
  onClick?: (e: MenuEvent) => void;
}

// 位置配置
export interface PositionConfig {
  boundary?: boolean;
  offset?: number;
  placement?: 'auto' | 'top' | 'bottom' | 'left' | 'right';
  fixed?: boolean;
  useElementPosition?: boolean;
  calculate?: (e: MouseEvent, menuSize: MenuSize) => Position;
}

// 菜单尺寸
export interface MenuSize {
  width: number;
  height: number;
}

// 位置坐标
export interface Position {
  x: number;
  y: number;
}

// 菜单事件
export interface MenuEvent {
  clientX?: number;
  clientY?: number;
  pageX?: number;
  pageY?: number;
  screenX?: number;
  screenY?: number;
  target?: Element;
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  button?: number;
}

// 插件选项
export interface InstallOptions {
  framework?: 'vue3' | 'react';
  theme?: string;
  position?: PositionConfig;
  onError?: (error: { code: string; message: string }) => void;
}

// 错误处理返回类型
export interface ErrorResult {
  code: string;
  message: string;
}