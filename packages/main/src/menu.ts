import {Menu} from 'electron';

//const electron = require('electron');
//const BrowserWindow = electron.BrowserWindow;

const menuTemplate = [{
  label: '窗口',
  submenu: [
    {label: 'OCR'},
    {label: 'RPA'},
  ],
},{
  label: '设置',
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
