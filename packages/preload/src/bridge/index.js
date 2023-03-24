import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  changeRouteFromMenu: callback => ipcRenderer.on('main-process-menu', callback),
  addImageFromNode: callback => ipcRenderer.on('node:addImage', callback),
  openImgSelectorDialog: type => ipcRenderer.invoke('dialog:selectImg', type),
  readImgFromPath: path => ipcRenderer.invoke('node:readImgFromPath', path),
  readTextFile: (path, type) => ipcRenderer.invoke('node:readTextFile', path, type),
  writeTextFile: (path, content, type) => ipcRenderer.invoke('node:writeTextFile', path, content, type),
})
