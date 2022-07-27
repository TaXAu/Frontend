import {router} from '../router';
import type {imgInfoType} from '../../../../types/bridge';

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

export async function openImgSelectorDialog(type?: 'file' | 'directory')
  : Promise<imgInfoType[] | void> {
  type = type || 'file';
  const result: imgInfoType[] | void = await electronAPI.openImgSelectorDialog(type);
  return result;
}
