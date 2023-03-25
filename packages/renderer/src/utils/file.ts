export async function saveObjToJsonFile(obj: any) {
  // 请求用户选择保存文件的位置
  const opts = {
    types: [
      {
        description: 'JSON Files',
        accept: {
          'application/json': ['.json'],
        },
      },
    ],
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const fileHandle = await window.showSaveFilePicker(opts)

  // 将对象转换为 JSON
  const objJson = JSON.stringify(obj)

  // 创建文件写入流
  const writable = await fileHandle.createWritable()

  // 写入JSON到文件中
  await writable.write(objJson)

  // 完成写入后关闭文件
  await writable.close()
}

export async function readJSONFile(): Promise<any> {
  // 请求用户选择一个 JSON 文件
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const [fileHandle] = await window.showOpenFilePicker({
    types: [{
      description: 'JSON 文件',
      accept: {
        'application/json': ['.json'],
      },
    }],
  })

  // 获取用户选择的文件的内容
  const file = await fileHandle.getFile()
  const contents = await file.text()

  // 将 JSON 数据转换为对象
  // 返回解析出的对象
  return JSON.parse(contents)
}
