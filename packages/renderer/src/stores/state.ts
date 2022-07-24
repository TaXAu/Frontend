import {defineStore} from 'pinia';
import type {ocrPageKeyType} from '/@/config';
import {ocrSubNavItem} from '/@/config';

const NULL_STR = '';
const OCR_DEFAULT_PAGE_KEY = ocrSubNavItem.at(0)!.key;

export const stateStore = defineStore({
  id: 'state-store',
  state: () => {
    return {
      ocr: {
        setId: NULL_STR,
        imgId: NULL_STR,
        nowPage: OCR_DEFAULT_PAGE_KEY,
      },
    };
  },
  getters: {
    /*
    OCR Page Functions
     */
    isInSet: (state) => state.ocr.setId !== NULL_STR,
    isSelectImg: (state) => state.ocr.imgId !== NULL_STR,
  },
  actions: {
    /*
    OCR Page Functions
     */
    isInPage(key: ocrPageKeyType) {
      return this.ocr.nowPage === key;
    },
    isOcrSubNavItemEnabled(key: ocrPageKeyType) {
      switch (key) {
        case 'prj-overview':
          return true;
        case 'img-overview':
          return this.isInSet;
        case 'img-info':
          return this.isSelectImg;
        case 'data-management':
          return this.isInSet;
        case 'prj-settings':
          return this.isInSet;
      }
    },
    changeOcrPage(key: ocrPageKeyType) {
      if (this.isOcrSubNavItemEnabled(key)) {
        this.ocr.nowPage = key;
        return true;
      }
      return false;
    },
    intoSet(id: string) {
      this.ocr.setId = id;
    },
    exitSet() {
      this.ocr.setId = NULL_STR;
      this.ocr.nowPage = OCR_DEFAULT_PAGE_KEY;
    },
  },
});
