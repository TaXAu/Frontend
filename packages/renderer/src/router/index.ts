import { createRouter, createWebHashHistory } from 'vue-router';
import home from '../pages/HomeView.vue';
import ocr from '../pages/OcrView.vue';
import rpa from '../pages/RpaView.vue';
import settings from '../pages/SettingsView.vue';

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
  {
    path: '/settings',
    name: 'settings',
    component: settings,
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

