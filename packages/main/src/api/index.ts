import { lstat, readFile, readdir } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { BrowserWindow, dialog } from 'electron'
import { compressImage } from '/@/api/image'
import type { imgInfoDataUrlType } from '../../../../types/bridge'
import { READ_IMG_FROM_FS_CODE as CODE } from '../../../../config/code'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mime = require('mime-types')

const SUPPORT_IMAGE_MIME = new Set(['image/jpg', 'image/jpeg', 'image/png'])

export async function readImgFromFileOrDirectory(filePath: string[] | void): Promise<imgInfoDataUrlType[] | void> {
  let result: imgInfoDataUrlType[] = []
  if (typeof filePath !== 'undefined') {
    for (const i in filePath) {
      const itemPath = filePath[i]
      // judge if it is a file or a directory
      // eslint-disable-next-line no-console
      const stats = await lstat(itemPath).catch(err => console.log(err))
      if (stats?.isFile()) {
        // judge if it is a image
        const fileType = mime.lookup(itemPath)
        if (fileType !== 'undefined' && SUPPORT_IMAGE_MIME.has(fileType)) {
          // read img data(base64) with img compress
          // eslint-disable-next-line no-console
          const rawData = await readFile(itemPath).catch(err => console.log(err))
          if (rawData !== undefined) {
            // eslint-disable-next-line no-console
            console.time('compress image')
            const { extension, binary } = await compressImage(<Buffer>rawData)
            // eslint-disable-next-line no-console
            console.timeEnd('compress image')
            const buffer = Buffer.from(binary, 'binary')
            const data = buffer.toString('base64')
            const type = mime.lookup(extension)
            // push to result
            if (typeof data !== 'undefined') {
              const tmpResult = {
                filename: basename(itemPath),
                filetype: fileType,
                path: itemPath,
                dataUrl: `data:${type};base64,${data}`,
              }
              addImgToIndexedDB(tmpResult)
              result.push(tmpResult)
            }
          }
        }
      }
      else if (stats?.isDirectory()) {
        // eslint-disable-next-line no-console
        const files = await readdir(itemPath).catch(err => console.log(err))
        const tmpFilePath = files?.map(file => join(itemPath, file))
        // eslint-disable-next-line no-console
        const tmpResult = await readImgFromFileOrDirectory(tmpFilePath).catch(err => console.log(err))
        if (typeof tmpResult !== 'undefined')
          result = [...result, ...tmpResult]
      }
    }
  }
  return result
}

export async function openImgSelectorDialog(type?: 'file' | 'directory') {
  // let filePathList;
  const result = await dialog.showOpenDialog({
    title: '选择图片',
    filters: [
      { name: '图片', extensions: ['jpg', 'jpeg', 'png'] },
      { name: '所有文件', extensions: ['*'] },
    ],
    properties: [
      type === 'directory' ? 'openDirectory' : 'openFile',
      'multiSelections',
    ],
  })
  if (!result.canceled)
    return readImgFromFileOrDirectory(result.filePaths)
  else
    // eslint-disable-next-line no-void
    return void 0
}

export function addImgToIndexedDB(img: imgInfoDataUrlType) {
  const win = BrowserWindow.getAllWindows().find(w => !w.isDestroyed())
  if (win !== undefined)
    win.webContents.send('node:addImage', img)
}

export async function readImgFromPath(path: string):
Promise<{ result: imgInfoDataUrlType | void; code: number }> {
  const fileType = mime.lookup(path)
  // eslint-disable-next-line no-console
  const data = await readFile(path).catch(err => console.log(err))
  if (data) {
    const result = {
      filename: basename(path),
      filetype: fileType,
      path,
      dataUrl: `data:${fileType};base64,${data.toString('base64')}`,
    }
    return { result, code: CODE.SUCCESS }
  }
  else {
    // eslint-disable-next-line no-void
    return { result: void 0, code: CODE.FAIL }
  }
}
