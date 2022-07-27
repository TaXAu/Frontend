import {defineStore} from 'pinia';
import type {ocrPageKeyType} from '/@/config';
import {ROUTE_NAME} from '/@/config';

const NULL_STR = '';

export const stateStore = defineStore({
  id: 'state-store',
  state: () => {
    const tmpPage: any = null;
    return {
      page: tmpPage,
      home: {
        page: tmpPage,
      },
      ocr: {
        prjId: NULL_STR,
        imgId: NULL_STR,
        page: tmpPage,
      },
      rpa: {
        page: tmpPage,
      },
      settings: {
        page: tmpPage,
      },
    };
  },
  getters: {
    /*
    OCR Page Functions
     */
    isInSet: (state) => state.ocr.prjId !== NULL_STR,
    isSelectImg: (state) => state.ocr.imgId !== NULL_STR,
  },
  actions: {
    /*
    OCR Page Functions
     */
    clearOcrImgId() {
      this.ocr.imgId = NULL_STR;
    },
    clearOcrPrjId() {
      this.ocr.prjId = NULL_STR;
    },
    isOcrSubNavItemEnabled(key: ocrPageKeyType) {
      switch (key) {
        case ROUTE_NAME.OCR_PROJECTS:
          return true;
        case ROUTE_NAME.OCR_PROJECT_IMAGES:
          return this.isInSet;
        case ROUTE_NAME.OCR_PROJECT_IMAGE_DETAIL:
          return this.isSelectImg;
        case ROUTE_NAME.OCR_PROJECT_DATA:
          return this.isInSet;
        case ROUTE_NAME.OCR_PROJECT_CONFIG:
          return this.isInSet;
      }
    },
  },
});
