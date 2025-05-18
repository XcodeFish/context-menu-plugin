import { createApp } from 'vue';
import App from './App.vue';
import ContextMenu from '../../src/vue3';

const app = createApp(App);

// 注册右键菜单插件
app.use(ContextMenu);

app.mount('#app');
