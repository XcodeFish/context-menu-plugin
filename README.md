# Context Menu Plugin User Guide

A powerful context menu plugin that supports both Vue 3 and React.

## Features

- 🎯 Framework agnostic - supports both Vue 3 and React
- 🎨 Themes support - includes light/dark themes and custom themes
- 📱 Responsive - works on both desktop and mobile devices
- ⌨️ Full keyboard navigation
- 🔍 Context-aware menu items
- 🎭 Transition animations
- ♿ Accessibility support
- 🛡️ TypeScript support

## Installation

```bash
# NPM
npm install context-menu-plugin

# Yarn
yarn add context-menu-plugin

# PNPM
pnpm add context-menu-plugin
```

### Framework Dependencies

For Vue 3:

```bash
npm install vue@^3.2.0
```

For React:

```bash
npm install react@^16.8.0 react-dom@^16.8.0
```

## Usage

### Vue 3

1. Register the plugin in your main.js:

```javascript
import { createApp } from 'vue'
import ContextMenu from 'context-menu-plugin'
import App from './App.vue'

const app = createApp(App)
app.use(ContextMenu, { framework: 'vue3' })
app.mount('#app')
```

2. Use in components:

```vue
<template>
  <div v-contextmenu="menuItems">Right click here</div>
</template>

<script setup>
const menuItems = [
  { label: 'Copy', handler: () => console.log('Copy') },
  { label: 'Paste', handler: () => console.log('Paste') },
  { type: 'separator' },
  {
    label: 'More Actions',
    children: [
      { label: 'Action 1', handler: () => console.log('Action 1') },
      { label: 'Action 2', handler: () => console.log('Action 2') }
    ]
  }
]
</script>
```

### React

1. Import and use in your component:

```jsx
import { useContextMenu, ContextMenu } from 'context-menu-plugin/react'

function App() {
  const { showContextMenu, ...menuProps } = useContextMenu()

  const menuItems = [
    { label: 'Copy', onClick: () => console.log('Copy') },
    { label: 'Paste', onClick: () => console.log('Paste') },
    { type: 'separator' },
    {
      label: 'More Actions',
      children: [
        { label: 'Action 1', onClick: () => console.log('Action 1') },
        { label: 'Action 2', onClick: () => console.log('Action 2') }
      ]
    }
  ]

  return (
    <div onContextMenu={(e) => showContextMenu(e, menuItems)}>
      Right click here
      <ContextMenu {...menuProps} />
    </div>
  )
}
```

## Advanced Features

### Context-Aware Menus

The plugin can automatically adjust menu items based on the right-clicked element.

Vue 3:

```vue
<template>
  <img v-contextmenu="{ contextAware: true }" src="image.jpg" />
  <a v-contextmenu="{ contextAware: true }" href="https://example.com">Link</a>
</template>
```

React:

```jsx
import { createContextAwareHandler } from 'context-menu-plugin/react'

function App() {
  const { showContextMenu, ...menuProps } = useContextMenu()
  const handleContextAware = createContextAwareHandler(showContextMenu)

  return (
    <>
      <img onContextMenu={handleContextAware} src="image.jpg" />
      <a onContextMenu={handleContextAware} href="https://example.com">Link</a>
      <ContextMenu {...menuProps} />
    </>
  )
}
```

### Themes

You can use built-in themes or create custom themes.

Vue 3:

```vue
<template>
  <div v-contextmenu="{ items: menuItems, theme: 'dark' }">
    Dark theme menu
  </div>
</template>
```

React:

```jsx
showContextMenu(e, menuItems, { theme: 'dark' })
```

### Position Configuration

Control menu positioning with various options:

```javascript
const positionConfig = {
  boundary: true,          // Enable boundary detection
  offset: 10,             // Offset from edges
  placement: 'bottom',     // Preferred placement
  fixed: false            // Use fixed positioning
}
```

Vue 3:

```vue
<template>
  <div v-contextmenu="{ items: menuItems, position: positionConfig }">
    Custom position
  </div>
</template>
```

React:

```jsx
showContextMenu(e, menuItems, positionConfig)
```

### Menu Item Types

```typescript
interface MenuItem {
  label: string | VNode          // Menu item label
  handler?: () => void          // Click handler (Vue)
  onClick?: () => void          // Click handler (React)
  disabled?: boolean            // Disable the item
  type?: 'normal' | 'separator' // Item type
  children?: MenuItem[]         // Submenu items
  icon?: string | ReactNode     // Item icon
  shortcut?: string            // Keyboard shortcut display
}
```

## Styling

### Built-in Themes

- light (default)
- dark
- blue
- green

### Custom Styling

Using CSS Variables:

```css
:root {
  --cm-bg-color: white;
  --cm-text-color: black;
  --cm-border-color: #ddd;
  --cm-hover-bg: #f5f5f5;
  --cm-disabled-opacity: 0.5;
}
```

### CSS Classes

- `.context-menu` - Main container
- `.cm-item` - Menu item
- `.cm-separator` - Separator line
- `.cm-disabled` - Disabled item
- `.cm-submenu` - Submenu container
- `.cm-theme-{name}` - Theme specific class

## API Reference

### Vue 3 Directive

```typescript
v-contextmenu="config"

interface Config {
  items?: MenuItem[]
  theme?: string
  position?: PositionConfig
  contextAware?: boolean
}
```

### React Hook

```typescript
const {
  visible: boolean,
  position: { x: number, y: number },
  items: MenuItem[],
  showContextMenu: (e: Event, items?: MenuItem[], config?: Config) => void,
  hideContextMenu: () => void,
  menuRef: React.RefObject
} = useContextMenu(options?: {
  theme?: string
})
```

## Browser Support

- Chrome >= 60
- Firefox >= 55
- Safari >= 12.1
- Edge >= 79

## Accessibility

The plugin follows WAI-ARIA guidelines:

- Proper ARIA roles
- Keyboard navigation
- Focus management
- Screen reader support

## TypeScript Support

The plugin includes TypeScript definitions for all features.
