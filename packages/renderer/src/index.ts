import {createApp} from 'vue';
import App from '/@/App.vue';
import {createPinia} from 'pinia';
import {router} from '/@/router';
import 'virtual:windi.css';
import 'virtual:windi-devtools';
import '@fontsource/noto-sans-sc';
import '@fontsource/noto-serif-sc';
// load electron api
import '../electron/api';

createApp(App).use(createPinia()).use(router).mount('#app');

