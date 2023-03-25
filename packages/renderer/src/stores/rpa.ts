import { defineStore } from 'pinia'
import { Workflow } from '/@/utils/rpa'

export const rpaStore = defineStore({
  id: 'rpa-store',
  state: () => ({
    workflow: new Workflow('tmp'),
  }),
})
