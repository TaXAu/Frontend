import { app, ipcMain } from 'electron'
import './security-restrictions'
import { restoreOrCreateWindow } from '/@/mainWindow'
import changeMenu from '/@/menu'
import { openImgSelectorDialog, readImgFromPath } from '/@/api'
import { readTextFile, writeTextFile } from '/@/api/file'

/**
 * Prevent multiple instances
 */

const isSingleInstance = app.requestSingleInstanceLock()
if (!isSingleInstance) {
  app.quit()
  process.exit(0)
}
app.on('second-instance', restoreOrCreateWindow)

/**
 * Disable Hardware Acceleration for more power-save
 */
app.disableHardwareAcceleration()

/**
 * Shout down background process if all windows was closed
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin')
    app.quit()
})

/**
 * @see https://www.electronjs.org/docs/v14-x-y/api/app#event-activate-macos Event: 'activate'
 */
app.on('activate', restoreOrCreateWindow)

/**
 * Create app window when background process will be ready
 */
app.whenReady()
  .then(restoreOrCreateWindow).then(() => {
    // load api from ./api/index.ts
    ipcMain.handle('dialog:selectImg', (e, args) => openImgSelectorDialog(args))
    ipcMain.handle('node:readImgFromPath', (e, args) => readImgFromPath(args))
    ipcMain.handle('node:readTextFile', (e, args1, args2) => readTextFile(args1, args2))
    ipcMain.handle('node:writeTextFile', (e, args1, args2, args3) => writeTextFile(args1, args2, args3))
  },
  )
  .catch(e => console.error('Failed create window:', e))

/**
 * Install Vue.js or some other devtools in development mode only
 */
if (import.meta.env.DEV) {
  app.whenReady()
    .then(() => import('electron-devtools-installer'))
    .then(({ default: installExtension, VUEJS3_DEVTOOLS }) => installExtension(VUEJS3_DEVTOOLS, {
      loadExtensionOptions: {
        allowFileAccess: true,
      },
    }))
    .catch(e => console.error('Failed install extension:', e))
}

/**
 * Check new app version in production mode only
 */
if (import.meta.env.PROD) {
  app.whenReady()
    .then(() => import('electron-updater'))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch(e => console.error('Failed check updates:', e))
}

// change default menu
changeMenu()
