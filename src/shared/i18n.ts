// 默认语言
let currentLocale = 'zh-CN';

// 语言包
export const messages = {
  'zh-CN': {
    copy: '复制',
    paste: '粘贴',
    cut: '剪切',
    save: '保存为',
    refresh: '刷新',
    viewImage: '查看图片',
    copyImage: '复制图片',
    saveImage: '保存图片',
    openInNewTab: '在新标签页中打开',
    copyLink: '复制链接地址',
    selectAll: '全选',
    search: '搜索'
  },
  'en-US': {
    copy: 'Copy',
    paste: 'Paste',
    cut: 'Cut',
    save: 'Save As',
    refresh: 'Refresh',
    viewImage: 'View Image',
    copyImage: 'Copy Image',
    saveImage: 'Save Image',
    openInNewTab: 'Open in New Tab',
    copyLink: 'Copy Link Address',
    selectAll: 'Select All',
    search: 'Search'
  }
};

// 设置语言
export function setLocale(locale: string) {
  if (messages[locale]) {
    currentLocale = locale;
  }
}

// 获取翻译
export function t(key: string): string {
  return messages[currentLocale]?.[key] || messages['en-US'][key] || key;
}

// 导出当前语言
export function getLocale(): string {
  return currentLocale;
}