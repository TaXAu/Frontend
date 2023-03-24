import { readTextFile, writeTextFile } from '/@/electron/api'
import { notify } from '/@/components/common/notification'

const url = 'http://localhost:8000'

export enum StatueCode {
  INITIAL = 0,
  INIT_ERROR = 1,
  READY = 2,
  RUNNING = 3,
  PENDING = 4,
  SUCCESS = 5,
  FAILED = 6,
}

export interface ModuleInfo {
  id: string
  name: string
  description: string
  version: string
  param: unknown
  args: unknown
  rtns: unknown
}

export async function testConnection(): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 1000)
    const response = await fetch(`${url}/api/test`, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    clearTimeout(timeout)
    return response.status === 200
  }
  catch (error) {
    return false
  }
}

export async function getModuleInfo(moduleId = null): Promise<ModuleInfo[] | null> {
  const getURL = moduleId
    ? `${url}/api/modules/list/` + `?module_id=${moduleId}`
    : `${url}/api/modules/list/`
  const result = await fetch(getURL, {
    method: 'GET',
    redirect: 'follow',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (result.ok)
    return result.json()
  else
    return null
}

interface ModuleData {
  id: string
  name: string
  param: Record<string, unknown>
  args: Record<string, unknown>
  rtns: string
}

interface WorkflowData {
  name: string
  id: string
  program: Array<ModuleData>
}

export class Workflow {
  data: WorkflowData

  // res: UseFileSystemAccessReturn<string|ArrayBuffer|Blob>;

  constructor(name: string) {
    this.data = {
      name,
      id: crypto.randomUUID(),
      program: [],
    }
    // const dataType = ref('Text') as Ref<'Text' | 'ArrayBuffer' | 'Blob'>;
    // this.res = useFileSystemAccess({
    //   dataType,
    //   types: [{
    //     description: 'TaXAu Workflow File',
    //     accept: {
    //       'text/plain': ['.txt', '.json'],
    //     },
    //   }],
    //   // excludeAcceptAllOption: true,
    // });
  }

  newID() {
    this.data.id = crypto.randomUUID()
  }

  addModule(moduleID: string, name: string, param: Record<string, unknown> = {},
            args: Record<string, unknown> = {}, rtns = '') {
    const moduleData: ModuleData = {
      id: moduleID,
      name,
      param,
      args,
      rtns,
    }
    this.data.program.push(moduleData)
  }

  changeModule(index: number, moduleID: string, name: string, param: Record<string, unknown> = {},
               args: Record<string, unknown> = {}, rtns = '') {
    this.data.program[index] = {
      id: moduleID,
      name,
      param,
      args,
      rtns,
    }
  }

  deleteModule(index: number) {
    this.data.program.splice(index, 1)
  }

  moveModule(index: number, direction: 'up' | 'down'): boolean {
    if (direction === 'up') {
      if (index === 0)
        return false

      const temp = this.data.program[index]
      this.data.program[index] = this.data.program[index - 1]
      this.data.program[index - 1] = temp
    }
    else {
      if (index >= this.data.program.length - 1)
        return false

      const temp = this.data.program[index]
      this.data.program[index] = this.data.program[index + 1]
      this.data.program[index + 1] = temp
    }

    return true
  }

  clear() {
    this.data.id = crypto.randomUUID()
    this.data.program = []
  }

  // async fromFile() {
  //   this.file.open().then((file) => {
  //
  //   }
  //
  // }

  async toFile() {
    const result = await writeTextFile(null, JSON.stringify(this.data), 'json')
    if (result.success)
      notify('保存成功', 'success')
    else
      notify('保存失败', 'error')
  }

  async fromFile() {
    const result = await readTextFile(null, 'json')
    if (result.data) {
      try {
        const tmpData = JSON.parse(result.data)
        if (tmpData.name && tmpData.id && tmpData.program) {
          this.data = tmpData
          notify('打开成功', 'success')
        }
      }
      catch (e) {
        notify('打开失败', 'error')
        console.error(e)
      }
    }
  }

  toJSON() {
    return JSON.stringify(this.data)
  }

  fromJSON(json: string) {
    this.data = JSON.parse(json)
  }

  fromObject(obj: WorkflowData) {
    this.data = obj
  }

  getAction(index: number) {
    return this.data.program[index]
  }

  setAction(index: number, action: ModuleData) {
    this.data.program[index] = action
  }
}

export class Task {
  async add(task: WorkflowData): Promise<boolean> {
    const result = await fetch(`${url}/api/tasks/add/`, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    })
    if (result.ok)
      return await result.json() as Promise<boolean>
    else
      return false
  }

  async list() {
    const result = await fetch(`${url}/api/tasks/info/`, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (result.ok)
      return result.json()
  }

  async run(taskId: string): Promise<boolean> {
    const result = await fetch(`${url}/api/tasks/run?id=${taskId}`, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (result.ok)
      return await result.json() as Promise<boolean>
    else
      return false
  }

  async status(id: null | string = null): Promise<[]> {
    const result = await fetch(`${url}/api/tasks/status${id === null ? '' : `?id=${id}`}`, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (result.ok)
      return result.json()
    else
      return []
  }

  async delete(taskId: string) {
    const result = await fetch(`${url}/api/tasks/delete?id=${taskId}`, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return result.ok
  }
}
