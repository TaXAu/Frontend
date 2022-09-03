import {defineStore} from 'pinia';

export const flowStore = defineStore({
  id: 'flow-store',
  state: () => {
    return {
      modules: [{
        name: '浏览器',
        type: 'category',
        modules: [
          {
            name: '打开浏览器',
          },
          {
            name: '关闭浏览器',
          },
        ],
      }, {
        name: '系统',
        type: 'category',
        modules: [],
      }, {}],

    };
  },
});
