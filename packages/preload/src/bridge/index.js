import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  changeRouteFromMenu: (callback) => ipcRenderer.on('main-process-menu', callback),
});
