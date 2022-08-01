import {defineStore} from 'pinia';
import type {ocrPageKeyType} from '/@/config';
import {ROUTE_NAME} from '/@/config';
import {getImgInfo, getPrjInfo} from '/@/utils/prjDb';
import type {img, prjInfo} from '/@/utils/indexDB';

export const stateStore = defineStore({
  id: 'state-store',
  state: () => {
    return {
      page: <any>null,
      home: {
        page: <any>null,
      },
      ocr: {
        prjId: <string | null>null,
        imgId: <string | null>null,
        prj: <prjInfo | null>null,
        img: <img | null>null,
        page: <any>null,
      },
      rpa: {
        page: <any>null,
      },
      settings: {
        page: <any>null,
      },
    };
  },
  getters: {
    /*
    OCR Page Functions
     */
    isInSet: (state) => state.ocr.prjId !== null,
    isSelectImg: (state) => state.ocr.imgId !== null,
  },
  actions: {
    /*
    OCR Page Functions
     */
    clearOcrImgId() {
      this.ocr.imgId = null;
    },
    clearOcrPrjId() {
      this.ocr.prjId = null;
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
    _updateStorePrjInfo() {
      if (this.isInSet) {
        getPrjInfo(<string>this.ocr.prjId).then((info) => {
          if (info) {
            this.ocr.prj = info;
          }
        });
      }
    },
    _updateStoreImgInfo() {
      if (this.isSelectImg) {
        getImgInfo(<string>this.ocr.imgId).then((info) => {
          if (info) {
            this.ocr.img = info;
          }
        });
      }
    },
  },
});
