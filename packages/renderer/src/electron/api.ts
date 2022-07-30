import {router} from '../router';
import type {imgInfoDataUrlType} from '../../../../types/bridge';
import {addImgFromNode} from '/@/utils/prjDb';
import type {READ_IMG_FROM_FS_CODE} from '../../../../config/code';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const electronAPI = window.electronAPI;

// change current route use menu buttons
electronAPI.changeRouteFromMenu((event: any, route: any) => {
  import('/@/stores/state').then((m) => {
    const state = m.stateStore();
    switch (route) {
      case '/':
        if (state.page) {
          router.push(state.page);
        } else {
          router.push('/');
        }
        break;

      case '/ocr':
        if (state.ocr.page) {
          router.push(state.ocr.page);
        } else {
          router.push('/ocr');
        }
        break;

      case '/rpa':
        if (state.rpa.page) {
          router.push(state.rpa.page);
        } else {
          router.push('/rpa');
        }
        break;

      case '/settings':
        if (state.settings.page) {
          router.push(state.settings.page);
        } else {
          router.push('/settings');
        }
    }
  });
});
// add image to indexedDB from Node (main process)
electronAPI.addImageFromNode((event: any, img: imgInfoDataUrlType) => addImgFromNode(img));

// open image selector dialog
// after getting the result
//    in main process the image(s) will be compressed
//    and then be added to indexedDB uses electronAPI.addImageFromNode
export async function openImgSelectorDialog(type?: 'file' | 'directory')
  : Promise<imgInfoDataUrlType[] | void> {
  type = type || 'file';
  const result: imgInfoDataUrlType[] | void = await electronAPI.openImgSelectorDialog(type);
  return result;
}

// read image from file system
export async function readImgFromPath(path: string):
  Promise<{ result: imgInfoDataUrlType | void, code: READ_IMG_FROM_FS_CODE }> {
  const result: { result: imgInfoDataUrlType, code: READ_IMG_FROM_FS_CODE }
    = await electronAPI.readImgFromPath(path);
  return result;
}

