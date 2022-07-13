import {Menu} from 'electron';
const { BrowserWindow } = require('electron');

const menuTemplate = [{
  label: '主页',
  click: () => changeRoute('/'),
},{
  label: 'OCR',
  click: () => changeRoute('/ocr'),
},{
  label: 'RPA',
  click: () => changeRoute('/rpa'),
},{
  label: '设置',
  click: () => changeRoute('/settings'),
},{
  label: '更多',
}];

function changeMenu() {
  switch (process.platform) {
    case 'darwin':
      break;
    case 'win32':
  }

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

export default changeMenu;

function changeRoute(route:string) {
  const win = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());
  if (win!==undefined) {
    win.webContents.send('main-process-menu', route);
  }
}
