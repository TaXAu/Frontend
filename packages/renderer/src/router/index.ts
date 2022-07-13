import { createRouter, createWebHashHistory } from 'vue-router';
import home from '../page/HomeView.vue';
import ocr from '../page/OcrView.vue';
import rpa from '../page/RpaView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: home,
  },
  {
    path: '/ocr',
    name: 'ocr',
    component: ocr,
  },
  {
    path: '/rpa',
    name: 'rpa',
    component: rpa,
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

