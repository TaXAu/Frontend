import {defineStore} from 'pinia';
import type {OcrSubNavItemType} from '../config';
import {OcrSubNavItem} from '../config';

export const stateStore = defineStore({
  id: 'state-store',
  state: () => {
    return {
      ocr: {
        subNav: {
          chosenKey: OcrSubNavItem.at(1)!.key,
        },
      },
    };
  },
  actions: {
    changeOcrSubNavChosenKey(key: OcrSubNavItemType['key']) {
      this.ocr.subNav.chosenKey = key;
    },
  },
});
