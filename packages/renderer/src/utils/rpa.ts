const url = 'http://localhost:8000';

export interface ModuleInfo {
  id: string,
  name: string,
  description: string
  version: string
  param: unknown
  args: unknown
  rtns: unknown
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

  async add(task: BodyInit) {
    return fetch(url + '/api/tasks/add/', {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
      body: task,
    });
  }

  async list() {
    return fetch(url + '/api/tasks/info/', {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async run(taskId: string) {
    return fetch(url + '/api/tasks/run/', {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id: taskId}),
    });
  }

  async status(taskId: string) {
    return fetch(url + '/api/tasks/status/', {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id: taskId}),
    });
  }
}
