import {createApp} from 'vue';
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

const store = await import('/@/stores/state');
const stateStore = store.stateStore();
stateStore.$subscribe((mutation, state) => {
  const events = mutation.events;
  if ((events as any)?.key) {
    switch ((events as any)?.key) {
      case 'prjId':
        stateStore._updateStorePrjInfo();
        break;

      case 'imgId':
        stateStore._updateStoreImgInfo();
        break;

      case 'changedPrjId':
        if ((typeof state.ocr.changedPrjId === 'string'
            && state.ocr.changedPrjId === state.ocr.prjId) ||
          (state.ocr.changedPrjId instanceof Array
            && new Set(state.ocr.changedPrjId).has(state.ocr.prjId ?? ''))) {
          stateStore._updateStoreImgInfo();
        }
        break;

      case 'changedImgId':
        if ((typeof state.ocr.changedImgId === 'string'
            && state.ocr.changedImgId === state.ocr.imgId) ||
          (state.ocr.changedImgId instanceof Array
            && new Set(state.ocr.changedImgId).has(state.ocr.imgId ?? ''))) {
          stateStore._updateStoreImgInfo();
        }
        break;
    }
  }
});

