<template>
  <Teleport to="body">
    <div v-if="visible" ref="menuEl" :class="['context-menu', `cm-theme-${theme}`]"
      :style="{ left: position.x + 'px', top: position.y + 'px' }" tabindex="-1" @keydown="handleKeyDown" role="menu"
      aria-orientation="vertical">

      <template v-for="(item, index) in menuItems" :key="index">
        <!-- 分隔线 -->
        <div v-if="item.type === 'separator'" class="cm-separator" role="separator"></div>

        <!-- 子菜单 -->
        <div v-else-if="item.children && item.children.length > 0" class="cm-item cm-submenu"
          :class="{ 'cm-disabled': item.disabled, 'cm-keyboard-focus': focusedIndex === index }"
          :tabindex="item.disabled ? -1 : 0" role="menuitem" aria-haspopup="true" aria-expanded="false">

          <span class="cm-label">{{ item.label }}</span>
          <span class="cm-submenu-arrow">
            &gt;
          </span>

          <!-- 递归渲染子菜单 -->
          <div class="cm-submenu-content">
            <div :class="['context-menu', `cm-theme-${theme}`]">
              <template v-for="(subItem, subIndex) in item.children" :key="subIndex">
                <div v-if="subItem.type === 'separator'" class="cm-separator" role="separator"></div>
                <div v-else class="cm-item" :class="{ 'cm-disabled': subItem.disabled }"
                  @click="(event) => handleClick(subItem, event)" :tabindex="subItem.disabled ? -1 : 0" role="menuitem">
                  <span class="cm-label">{{ subItem.label }}</span>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- 普通菜单项 -->
        <div v-else class="cm-item"
          :class="{ 'cm-disabled': item.disabled, 'cm-keyboard-focus': focusedIndex === index }"
          @click="(event) => handleClick(item, event)" :tabindex="item.disabled ? -1 : 0" role="menuitem"
          :aria-disabled="item.disabled">

          <span class="cm-label">{{ item.label }}</span>
        </div>
      </template>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { calculatePosition, debounce } from '../shared/utils'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  theme: {
    type: String,
    default: 'light'
  },
  maxWidth: {
    type: Number,
    default: null
  },
  zIndex: {
    type: Number,
    default: 1000
  },
  customClass: {
    type: String,
    default: ''
  },
  animation: {
    type: Boolean,
    default: true
  },
  closeOnScroll: {
    type: Boolean,
    default: true
  },
  closeOnResize: {
    type: Boolean,
    default: true
  }
})

const visible = ref(false)
const position = ref({ x: 0, y: 0 })
const menuSize = ref({ width: 0, height: 0 })
const menuItems = ref([])
const menuEl = ref(null)
const focusedIndex = ref(-1)

// 定义事件处理函数
const handleClickOutside = (e) => {
  if (menuEl.value && !menuEl.value.contains(e.target))
  {
    hide()
  }
}

const handleEscape = (e) => {
  if (e.key === 'Escape')
  {
    hide()
  }
}

// 使用防抖优化resize事件处理
const handleResize = debounce(() => {
  if (props.closeOnResize)
  {
    hide()
  }
}, 100)

// 使用防抖优化scroll事件处理  
const handleScroll = debounce(() => {
  if (props.closeOnScroll)
  {
    hide()
  }
}, 100)

// 隐藏菜单
const hide = () => {
  visible.value = false
  focusedIndex.value = -1

  // 移除所有事件监听器
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('contextmenu', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
  window.removeEventListener('scroll', handleScroll, true)
  window.removeEventListener('resize', handleResize)
}

// 显示菜单
const show = (e, items, positionConfig = {}) => {
  e?.preventDefault?.()
  menuItems.value = items || []

  nextTick(() => {
    // 初始化菜单尺寸
    menuSize.value = { width: 150, height: 200 }

    // 计算初始位置
    const { x, y } = calculatePosition(e, menuSize.value, {
      ...positionConfig,
      useElementPosition: false
    })
    position.value = { x, y }

    // 显示菜单
    visible.value = true

    // 添加事件监听器
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('contextmenu', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    if (props.closeOnScroll)
    {
      window.addEventListener('scroll', handleScroll, true)
    }

    if (props.closeOnResize)
    {
      window.addEventListener('resize', handleResize)
    }

    // 计算实际尺寸和最终位置
    if (menuEl.value)
    {
      const rect = menuEl.value.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0)
      {
        menuSize.value = {
          width: rect.width,
          height: rect.height
        }

        const finalPosition = calculatePosition(e, menuSize.value, {
          ...positionConfig,
          useElementPosition: false
        })
        position.value = finalPosition
      }
    }
  })
}

// 处理键盘导航
const handleKeyDown = (event) => {
  if (!visible.value) return

  const items = menuItems.value.filter(item => item.type !== 'separator')
  const itemCount = items.length

  switch (event.key)
  {
    case 'ArrowDown':
      event.preventDefault()
      if (itemCount > 0)
      {
        focusedIndex.value = (focusedIndex.value + 1) % itemCount
        focusMenuItem(focusedIndex.value)
      }
      break

    case 'ArrowUp':
      event.preventDefault()
      if (itemCount > 0)
      {
        focusedIndex.value = (focusedIndex.value - 1 + itemCount) % itemCount
        focusMenuItem(focusedIndex.value)
      }
      break

    case 'Enter':
    case ' ':
      event.preventDefault()
      if (focusedIndex.value >= 0 && focusedIndex.value < itemCount)
      {
        const item = items[focusedIndex.value]
        if (!item.disabled)
        {
          handleClick(item, event)
        }
      }
      break

    case 'Escape':
      event.preventDefault()
      hide()
      break

    case 'Tab':
      event.preventDefault()
      break
  }
}

// 聚焦菜单项
const focusMenuItem = (index) => {
  const items = menuEl.value?.querySelectorAll('.cm-item:not(.cm-disabled)')
  if (items?.[index])
  {
    items[index].focus()
  }
}

// 处理点击事件
const handleClick = (item, event) => {
  if (item.disabled) return

  const handler = item.onClick || item.handler
  if (typeof handler === 'function')
  {
    try
    {
      handler(event)
    } catch (err)
    {
      console.error('菜单项处理函数执行出错:', err)
    }
  }

  if (!item.children?.length)
  {
    hide()
  }
}

// 组件挂载时进行初始化
onMounted(() => {
  hide() // 确保初始状态是隐藏的
})

// 组件卸载前清理
onBeforeUnmount(() => {
  hide()
})

// 暴露方法给外部使用
defineExpose({
  show,
  hide
})
</script>

<style lang="scss">
@use '../styles/menu.scss';
</style>
