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
    }
  }
  console.log(mutation.events);
  console.log(state);
});

