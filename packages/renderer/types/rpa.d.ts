export interface FlowProgramType {
  name: string,
  id: string,
  paras: Record<string, unknown>
}


export interface FlowType {
  name: string,
  id: string,
  program: FlowProgramType[]
}
