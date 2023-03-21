const url = 'http://localhost:8000';

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
  id: string,
  name: string,
  description: string
  version: string
  param: unknown
  args: unknown
  rtns: unknown
}

export async function testConnection(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1000);
    const response = await fetch(url + '/api/test', {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    clearTimeout(timeout);
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

export async function getModuleInfo(moduleId = null): Promise<ModuleInfo[] | null> {
  const getURL = moduleId
    ? url + '/api/modules/list/' + `?module_id=${moduleId}`
    : url + '/api/modules/list/';
  const result = await fetch(getURL, {
    method: 'GET',
    redirect: 'follow',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (result.ok) {
    return result.json();
  } else {
    return null;
  }
}

interface ModuleData {
  id: string;
  name: string;
  param: Record<string, unknown>;
  args: Record<string, unknown>;
  rtns: string;
}

interface WorkflowData {
  name: string;
  id: string;
  program: Array<ModuleData>;
}

export class Workflow {
  data: WorkflowData;

  constructor(name: string) {
    this.data = {
      name,
      id: crypto.randomUUID(),
      program: [],
    };
  }

  addModule(moduleID: string, name: string, param: Record<string, unknown> = {},
            args: Record<string, unknown> = {}, rtns = '') {
    const moduleData: ModuleData = {
      id: moduleID,
      name,
      param,
      args,
      rtns,
    };
    this.data.program.push(moduleData);
  }

  changeModule(index: number, moduleID: string, name: string, param: Record<string, unknown> = {},
               args: Record<string, unknown> = {}, rtns = '') {
    this.data.program[index] = {
      id: moduleID,
      name,
      param,
      args,
      rtns,
    };
  }

  deleteModule(index: number) {
    this.data.program.splice(index, 1);
  }

  moveModule(index: number, direction: 'up' | 'down') {
    if (direction === 'up') {
      if (index === 0) {
        return;
      }
      const temp = this.data.program[index];
      this.data.program[index] = this.data.program[index - 1];
      this.data.program[index - 1] = temp;
    } else {
      if (index >= this.data.program.length - 1) {
        return;
      }
      const temp = this.data.program[index];
      this.data.program[index] = this.data.program[index + 1];
      this.data.program[index + 1] = temp;
    }
  }

  toJSON() {
    return JSON.stringify(this.data);
  }

  fromJSON(json: string) {
    this.data = JSON.parse(json);
  }

  fromObject(obj: WorkflowData) {
    this.data = obj;
  }

  getAction(index: number) {
    return this.data.program[index];
  }

  setAction(index: number, action: ModuleData) {
    this.data.program[index] = action;
  }
}


export class Task {

  async add(task: WorkflowData) {
    const result = await fetch(url + '/api/tasks/add/', {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (result.ok) {
      return result.json();
    }
  }

  async list() {
    const result = await fetch(url + '/api/tasks/info/', {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (result.ok) {
      return result.json();
    }
  }

  async run(taskId: string) {
    const result = await fetch(url + '/api/tasks/run?id=' + taskId, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (result.ok) {
      return result.json();
    }
  }

  async status(id: null | string = null): Promise<[]> {
    const result = await fetch(url + '/api/tasks/status' + (id === null ? '' : `?id=${id}`), {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (result.ok) {
      return result.json();
    } else {
      return [];
    }
  }

  async delete(taskId: string) {
    const result = await fetch(url + '/api/tasks/delete?id=' + taskId, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return result.ok;
  }
}
