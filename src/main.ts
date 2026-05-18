import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { initializeAppTheme } from './composables/useTheme';
import './index.css';

const app = createApp(App);
const pinia = createPinia();

// Initialize theme on app startup
initializeAppTheme();

app.use(pinia);
app.mount('#app');
