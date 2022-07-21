const mime = require('mime-types');
import {dialog} from 'electron';
import {lstat, readdir, readFile} from 'node:fs/promises';
import {basename, join} from 'path';
import {compressImage} from '/@/api/image';
import type {imgInfoType} from '../../../../types/bridge';

const SUPPORT_IMAGE_MIME = new Set(['image/jpg', 'image/jpeg', 'image/png']);


export async function readImgFromFileOrDirectory(filePath: string[] | void): Promise<imgInfoType[] | void> {

  let result: imgInfoType[] = [];
  if (typeof filePath !== 'undefined') {
    for (const i in filePath) {
      const itemPath = filePath[i];
      // judge if it is a file or a directory
      const stats = await lstat(itemPath).catch((err) => console.log(err));
      if (stats?.isFile()) {
        // judge if it is a image
        const fileType = mime.lookup(itemPath);
        if (fileType !== 'undefined' && SUPPORT_IMAGE_MIME.has(fileType)) {
          // read imgdata(base64) with img compress
          const rawData = await readFile(itemPath).catch((err) => console.log(err));
          if (rawData !== undefined) {
            const {extension, binary} = await compressImage(<Buffer>rawData);
            const buffer = Buffer.from(binary, 'binary');
            const data = buffer.toString('base64');
            const type = mime.lookup(extension);
            // push to result
            if (typeof data !== 'undefined') {
              result.push({
                filename: basename(itemPath),
                filetype: fileType,
                path: itemPath,
                dataUrl: `data:${type};base64,${data}`,
              });
            }
          }
        }
      } else if (stats?.isDirectory()) {
        const files = await readdir(itemPath).catch((err) => console.log(err));
        const tmpFilePath = files?.map((file) => join(itemPath, file));
        const tmpResult = await readImgFromFileOrDirectory(tmpFilePath).catch((err) => console.log(err));
        if (typeof tmpResult !== 'undefined') {
          result = [...result, ...tmpResult];
        }
      }
    }
  }
  return result;
}

export async function openImgSelectorDialog(type?: 'file' | 'directory') {
  //let filePathList;
  const result = await dialog.showOpenDialog({
    title: '选择图片',
    filters: [
      {name: '图片', extensions: ['jpg', 'jpeg', 'png']},
      {name: '所有文件', extensions: ['*']},
    ],
    properties: [
      type === 'directory' ? 'openDirectory' : 'openFile',
      'multiSelections',
    ],
  });
  if (!result.canceled) {
    return readImgFromFileOrDirectory(result.filePaths);
  } else {
    return void 0;
  }
}

