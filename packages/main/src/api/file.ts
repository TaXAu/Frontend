import { readFile, writeFile } from 'node:fs/promises'
import { dialog } from 'electron'

type FileType = 'json'
const fileTypes = {
  json: {
    filter: {
      name: 'JSON',
      extensions: ['json'],
    },
  },
}

export async function readTextFile(path: string | null = null, type: FileType): Promise<{ path: string | null; data: string | null }> {
  if (path === null) {
    const result = await dialog.showOpenDialog({
      title: '选择文件',
      filters: [
        fileTypes[type].filter,
        { name: '所有文件', extensions: ['*'] },
      ],
      properties: ['openFile'],
    })
    if (!result.canceled)
      path = result.filePaths[0]
    else
      return { path: null, data: null }
  }

  // read file
  // eslint-disable-next-line no-console
  const data = await readFile(path, 'utf-8').catch(err => console.log(err))
  if (data === undefined)
    return { path: null, data: null }

  return { path, data }
}

export async function writeTextFile(path: string | null, data: string, type: FileType): Promise<{ path: string | null; success: boolean }> {
  // save file
  if (path === null) {
    const result = await dialog.showSaveDialog({
      title: '保存文件',
      filters: [
        fileTypes[type].filter,
        { name: '所有文件', extensions: ['*'] },
      ],
    })
    if (!result.canceled && result.filePath)
      path = result.filePath
    else
      return { path: null, success: false }
  }
  let success = true
  writeFile(path, data).catch((err) => {
    // eslint-disable-next-line no-console
    console.log(err)
    success = false
  })
  return { path, success }
}
