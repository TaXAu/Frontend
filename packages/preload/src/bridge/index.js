import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  changeRouteFromMenu: (callback) => ipcRenderer.on('main-process-menu', callback),
  openImgSelectorDialog: (type) => ipcRenderer.invoke('dialog:selectImg', type),
  addImageFromNode: (callback) => ipcRenderer.on('node:addImage', callback),
});
