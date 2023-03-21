import {createApp, watch} from 'vue';
// import { plugin, defaultConfig } from '@formkit/vue';
import App from '/@/App.vue';
import {createPinia} from 'pinia';
import {router} from '/@/router';
import 'virtual:windi.css';
import 'virtual:windi-devtools';
import '@fontsource/noto-sans-sc';
import '@fontsource/noto-serif-sc';
// load electron api
import './electron/api';

createApp(App).use(createPinia()).use(router).mount('#app');

/* Pinia Store Auto Update */
const store = await import('/@/stores/state');
const stateStore = store.stateStore();
watch(() => stateStore.ocr.prjId, () => stateStore._updateStorePrjInfo());
watch(() => stateStore.ocr.imgId, () => stateStore._updateStoreImgInfo());
