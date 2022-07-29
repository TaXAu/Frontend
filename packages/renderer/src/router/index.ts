import {createRouter, createWebHashHistory} from 'vue-router';
import home from '../pages/HomeView.vue';
import ocr from '../pages/OcrView.vue';
import rpa from '../pages/RpaView.vue';
import PrjConfig from '../components/ocr/Prj/PrjConfig.vue';
import PrjView from '../components/ocr/Prj/PrjView.vue';
import ImgInfoView from '../components/ocr/ImgInfo/ImgInfoView.vue';
import ImgOverview from '../components/ocr/Img/ImgView.vue';
import settings from '../pages/SettingsView.vue';
import {stateStore} from '/@/stores/state';
import {getImgInfo} from '/@/utils/prjDb';
import {ROUTE_NAME} from '/@/config';

const routes = [{
  path: '/',
  name: ROUTE_NAME.HOME,
  component: home,
}, {
  path: '/ocr',
  name: ROUTE_NAME.OCR,
  redirect: {name: ROUTE_NAME.OCR_PROJECTS},
  component: ocr,
  children: [{
    path: 'project',
    name: ROUTE_NAME.OCR_PROJECTS,
    component: PrjView,
    meta: {
      keepAlive: true,
    },
  }, {
    path: 'project/config/:prjId',
    name: ROUTE_NAME.OCR_PROJECT_CONFIG,
    component: PrjConfig,
    props: true,
    meta: {
      keepAlive: true,
    },
  }, {
    path: 'project/image/:prjId',
    name: ROUTE_NAME.OCR_PROJECT_IMAGES,
    component: ImgOverview,
    props: true,
    meta: {
      keepAlive: true,
    },
  }, {
    path: 'project/image/detail/:imgId?',
    name: ROUTE_NAME.OCR_PROJECT_IMAGE_DETAIL,
    component: ImgInfoView,
    props: true,
    meta: {
      keepAlive: true,
    },
  }, {
    path: 'project/data/:prjId?',
    name: ROUTE_NAME.OCR_PROJECT_DATA,
    component: ImgInfoView,
    props: true,
    meta: {
      keepAlive: true,
    },
  }],
},
  {
    path: '/rpa',
    name: ROUTE_NAME.RPA,
    component: rpa,
  },
  {
    path: '/settings',
    name: ROUTE_NAME.SETTINGS,
    component: settings,
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// store image id and project id in state store
router.beforeEach(async (to, from) => {
  const store = stateStore();
  switch (to.name) {
    case ROUTE_NAME.OCR:
      break;

    case ROUTE_NAME.OCR_PROJECTS:
      break;

    case ROUTE_NAME.OCR_PROJECT_CONFIG:
    case ROUTE_NAME.OCR_PROJECT_DATA:
    case ROUTE_NAME.OCR_PROJECT_IMAGES:
      if (to.params?.prjId) {
        if (store.ocr.prjId !== to.params.prjId) {
          store.clearOcrImgId();
        }
        store.ocr.prjId = <string>to.params.prjId;
      } else if (store.ocr.prjId) {
        return {name: to.name, params: {prjId: store.ocr.prjId}};
      } else {
        return from;
      }
      break;

    case ROUTE_NAME.OCR_PROJECT_IMAGE_DETAIL:
      if (to.params?.imgId) {
        getImgInfo(<string>to.params?.imgId).then((img) => {
          if (img) {
            store.ocr.imgId = <string>to.params.imgId;
            store.ocr.prjId = img.prjId;
          } else {
            return {path: from.path};
          }
        });
      } else if (store.ocr.imgId) {
        return {name: to.name, params: {imgId: store.ocr.imgId}};
      } else {
        return from;
      }
      break;
  }
});


// store the top level of route in state store
router.afterEach((to, from) => {
  const store = stateStore();
  store.page = from;
  from.matched.find(item => {
    switch (item.name) {
      case ROUTE_NAME.HOME:
        store.home.page = from;
        break;

      case ROUTE_NAME.OCR:
        store.ocr.page = from;
        break;

      case ROUTE_NAME.RPA:
        store.rpa.page = from;
        break;

      case ROUTE_NAME.SETTINGS:
        store.settings.page = from;
        break;
    }
  });
});
