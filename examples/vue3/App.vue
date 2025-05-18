<template>
  <div class="app">
    <h1>Vue3 右键菜单示例</h1>

    <div class="demo-area" v-contextmenu="menuItems">
      在此区域右键点击（自定义菜单项）
    </div>

    <div class="demo-area" v-contextmenu="{ items: customMenuItems, position: positionConfig }">
      在此区域右键点击（自定义位置配置）
    </div>

    <div class="demo-area" v-contextmenu>
      在此区域右键点击（使用默认菜单项：复制、粘贴、保存为、刷新）
    </div>

    <div class="demo-area" v-contextmenu="{ theme: 'dark' }">
      在此区域右键点击（使用暗色主题）
    </div>

    <div class="demo-area" v-contextmenu="{ contextAware: true }">
      在此区域右键点击（使用上下文感知菜单）
    </div>

    <div class="demo-area" v-contextmenu="[]">
      在此区域右键点击（空菜单项，将使用默认菜单项）
    </div>

    <div class="test-section">
      <h3>测试区域</h3>
      <p v-contextmenu>这是一段可以选中的文本，尝试选中后右键使用"复制"功能。</p>
      <textarea class="text-area" v-contextmenu placeholder="在此输入文本，然后尝试右键菜单功能"></textarea>
      <p v-contextmenu>尝试在文本框中右键使用"粘贴"功能，或者选中文本后使用"保存为"功能。</p>

      <h3>上下文感知菜单测试</h3>
      <div class="context-aware-test">
        <img src="https://picsum.photos/300/200" alt="示例图片" v-contextmenu="{ contextAware: true }" class="test-image" />
        <p>
          在上面的图片上右键点击，将显示图片特定的菜单项。
          也可以在<a href="https://github.com" target="_blank" v-contextmenu="{ contextAware: true }">这个链接</a>上右键点击，
          将显示链接特定的菜单项。
        </p>
      </div>

      <h3>主题切换测试</h3>
      <div class="theme-test">
        <button @click="toggleTheme" class="theme-button">
          切换主题 (当前: {{ currentTheme }})
        </button>
        <div class="theme-demo" v-contextmenu="{ theme: currentTheme }" :class="{ 'dark-bg': currentTheme === 'dark' }">
          在此区域右键点击，使用当前主题 ({{ currentTheme }})
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 基本菜单项
const menuItems = [
  { label: '复制', handler: () => alert('复制') },
  { label: '粘贴', handler: () => alert('粘贴') },
  { label: '删除', handler: () => alert('删除'), disabled: true }
]

// 自定义菜单项
const customMenuItems = [
  {
    label: '编辑',
    children: [
      { label: '剪切', handler: () => alert('剪切') },
      { label: '复制', handler: () => alert('复制') },
      { label: '粘贴', handler: () => alert('粘贴') }
    ]
  },
  { type: 'separator' },
  { label: '刷新', handler: () => alert('刷新') },
  { label: '设置', handler: () => alert('设置') }
]

// 位置配置
const positionConfig = {
  boundary: true,
  offset: 15,
  placement: 'bottom'
}

// 主题切换
const currentTheme = ref('light')

const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
}
</script>

<style>
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

/* 上下文感知菜单测试样式 */
.context-aware-test {
  margin: 20px 0;
  padding: 15px;
  border: 1px dashed #ccc;
  border-radius: 4px;
  background-color: #f5f5f5;
}

.test-image {
  display: block;
  max-width: 100%;
  margin: 0 auto 15px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 主题切换测试样式 */
.theme-test {
  margin: 20px 0;
  padding: 15px;
  border: 1px dashed #ccc;
  border-radius: 4px;
  background-color: #f5f5f5;
}

.theme-button {
  padding: 8px 16px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 15px;
}

.theme-button:hover {
  background-color: #3a80d2;
}

.theme-demo {
  padding: 20px;
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid #ddd;
  transition: all 0.3s ease;
}

.dark-bg {
  background-color: #333;
  color: #fff;
  border-color: #555;
}

.test-section p {
  line-height: 1.6;
  margin: 15px 0;
}
</style>
