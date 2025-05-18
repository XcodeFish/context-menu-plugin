import { autoDetectFramework, defaultMenuItems, handleError, ErrorCodes } from './shared/utils';
import * as vue3 from './vue3';
import * as react from './react';
import { getContextAwareMenuItems, createContextAwareHandler } from './shared/contextAware';
import { setLocale, getLocale, t } from './shared/i18n';

// 自动检测框架
const detectFramework = () => {
  try {
    return autoDetectFramework();
  } catch (err) {
    handleError(err);
    return null;
  }
};

// 根据框架返回对应的实现
const getImplementation = (framework) => {
  const common = {
    getContextAwareMenuItems,
    createContextAwareHandler,
    defaultMenuItems,
    setLocale,
    getLocale,
    t
  };
  
  switch (framework) {
    case 'vue3':
      return { ...vue3, ...common };
    case 'react':
      return { ...react, ...common };
    default:
      return { vue3, react, ...common };
  }
};

// 导出所有版本和通用工具
export { 
  vue3, 
  react,
  getContextAwareMenuItems,
  createContextAwareHandler,
  defaultMenuItems,
  setLocale,
  getLocale,
  t,
  ErrorCodes
};

// 默认导出自动检测的版本
export default getImplementation(detectFramework());
