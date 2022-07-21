import {defineStore} from 'pinia';
import type {OcrSubNavItemType} from '../config';
import {OcrSubNavItem} from '../config';

const NULL_STR = '';

export enum ocrMainPageInfo {
  None,
  ImgSetOverview,
  ImgOverview
}

export const stateStore = defineStore({
  id: 'state-store',
  state: () => {
    return {
      ocr: {
        subNav: {
          chosenKey: OcrSubNavItem.at(1)!.key,
        },
        main: {
          nowPage: ocrMainPageInfo.ImgSetOverview,
          setId: NULL_STR,
        },
      },
    };
  },
  getters: {
    isInSet: (state) => state.ocr.main.setId !== NULL_STR,
    isOcrImgSetOverviewPage: (state) => state.ocr.main.nowPage === ocrMainPageInfo.ImgSetOverview,
    isOcrImgOverviewPage: (state) => state.ocr.main.nowPage === ocrMainPageInfo.ImgOverview,
  },
  actions: {
    changeOcrSubNavChosenKey(key: OcrSubNavItemType['key']) {
      this.ocr.subNav.chosenKey = key;
    },
    changeOcrMainPage(page: ocrMainPageInfo) {
      this.ocr.main.nowPage = page;
    },
    intoSet(id: string) {
      this.ocr.main.setId = id;
    },
    exitSet() {
      this.ocr.main.setId = NULL_STR;
      this.ocr.main.nowPage = ocrMainPageInfo.ImgSetOverview;
    },
  },
});
