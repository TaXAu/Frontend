import {router} from '../router';
import type {imgInfoType} from '../../../../types/bridge';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const electronAPI = window.electronAPI;

// change current route use menu buttons
electronAPI.changeRouteFromMenu((event: any, route: any) => router.push(route));

export async function openImgSelectorDialog(type?: 'file' | 'directory')
  : Promise<imgInfoType[] | void> {
  type = type || 'file';
  const result: imgInfoType[] | void = await electronAPI.openImgSelectorDialog(type);
  return result;
}
