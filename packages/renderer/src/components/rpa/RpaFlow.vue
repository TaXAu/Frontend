<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import type { ModuleInfo } from '/@/utils/rpa'
import { StatueCode, Task, getModuleInfo, testConnection } from '/@/utils/rpa'
import { notify } from '/@/components/common/notification'
import { rpaStore } from '/@/stores/rpa'

const modules = ref<ModuleInfo[] | null>([])
const moduleMap = ref(new Map())
const selectedModuleInList = ref<null | string>(null)
const selectedActionInFlow = ref<null | number>(null)
const workflowConstructor = rpaStore().workflow
const rpaTask = new Task()
const centerKey = ref(0)

onMounted(async () => {
  const connection = await testConnection()
  if (connection)
    notify('RPA连接成功', 'success')
  else
    notify('RPA连接失败', 'error')
})

const clickModuleList = (id: string) => {
  selectedModuleInList.value = id
  selectedActionInFlow.value = null
}

const clickActionFlow = (index: number) => {
  selectedActionInFlow.value = index
  selectedModuleInList.value = null
}

const clickAddButton = () => {
  const clearInput = function (obj: {} | null | undefined) {
    if (obj === undefined || obj === null)
      return {}

    return Object.fromEntries(Object.keys(obj).map(k => [k, '']))
  }
  if (selectedModuleInList.value !== null) {
    workflowConstructor.addModule(selectedModuleInList.value,
      `module ${workflowConstructor.data.program.length + 1}`,
      clearInput(moduleMap.value.get(selectedModuleInList.value).param),
      clearInput(moduleMap.value.get(selectedModuleInList.value).args),
      '',
    )
  }
}

const clickDelButton = () => {
  if (selectedActionInFlow.value !== null) {
    workflowConstructor.deleteModule(selectedActionInFlow.value)
    selectedActionInFlow.value = null
  }
}

const clickMoveUp = () => {
  if (selectedActionInFlow.value !== null) {
    const result = workflowConstructor.moveModule(selectedActionInFlow.value, 'up')
    if (result)
      selectedActionInFlow.value -= 1
  }
}

const clickMoveDown = () => {
  if (selectedActionInFlow.value !== null) {
    const result = workflowConstructor.moveModule(selectedActionInFlow.value, 'down')
    if (result)
      selectedActionInFlow.value += 1
  }
}

const clickRunButton = async () => {
  workflowConstructor.newID()
  const id = workflowConstructor.data.id
  // eslint-disable-next-line no-console
  console.log('Run Module')
  // eslint-disable-next-line no-console
  console.log(workflowConstructor.data)

  // add task
  const result1 = await rpaTask.add(workflowConstructor.data)
  if (!result1) {
    notify('任务添加失败', 'error')
    return
  }
  // run task
  const result2 = await rpaTask.run(id)
  if (!result2)
    notify('任务添加失败', 'error')

  else
    notify('任务添加成功', 'success')
}

const clickStatusButton = async () => {
  const id = workflowConstructor.data.id
  // eslint-disable-next-line no-console
  console.log('Status')
  const status = await rpaTask.status(id)
  // eslint-disable-next-line no-console
  console.log(status)
  if (status.length === 0) {
    notify('任务不存在', 'info')
  }
  else {
    switch (status.at(0)![1]) {
      case StatueCode.READY:
        notify('任务就绪', 'info')
        break
      case StatueCode.INITIAL:
        notify('任务初始化中', 'info')
        break
      case StatueCode.INIT_ERROR:
        notify('任务初始化失败', 'info')
        break
      case StatueCode.PENDING:
        notify('任务等待中', 'info')
        break
      case StatueCode.RUNNING:
        notify('任务运行中', 'info')
        break
      case StatueCode.SUCCESS:
        notify('任务运行成功', 'success')
        break
      case StatueCode.FAILED:
        notify('任务运行失败', 'error')
        break
      default:
        notify('任务状态未知', 'info')
        break
    }
  }
}

const clickSaveButton = () => {
  // eslint-disable-next-line no-console
  console.log('save file')
  workflowConstructor.toFile()
}

const clickLoadButton = () => {
  // eslint-disable-next-line no-console
  console.log('load')
  workflowConstructor.fromFile()
}

const clickResetButton = () => {
  selectedActionInFlow.value = null
  selectedModuleInList.value = null
  workflowConstructor.clear()
  centerKey.value += 1
}

getModuleInfo().then((value) => {
  if (value === null)
    return

  modules.value = value
  value.forEach((module: { id: string }) => moduleMap.value.set(module.id, module))
})

const curAction = computed({
  get() {
    if (selectedActionInFlow.value !== null)
      return workflowConstructor.data.program[selectedActionInFlow.value]

    return null
  },
  set(value) {
    if (selectedActionInFlow.value !== null)
      workflowConstructor.data.program[selectedActionInFlow.value] = value!
  },
})

// watch(workflowConstructor.value, (newValue) => {
//   console.log(newValue);
//   console.log(newValue.data.program[0].param);
// });

// const curActionParams = computed({
//   get() {
//     if (curAction.value) {
//       return Object.keys(curAction.value.param).map();
//     }
//     return null;
//   },
//   set(value) {
//     if (curAction.value) {
//       curAction.value.params = value!;
//     }
//   },
// });
</script>

<template>
  <div class="rpa-flow h-full">
    <div class="left flex flex-col">
      <div class="flex-auto my-2 bg-zinc-300/40 text-sm rounded-md leading-loose mx-2 overflow-y-auto">
        <div
          class="text-center my-2 font-bold"
        >
          模块列表
        </div>
        <div class="py-1">
          <div
            v-for="module in modules"
            :key="module.id"
            :class="{ select: selectedModuleInList === module.id }"
            class="modules bg-white hover:bg-blue-200 text-xs my-1 mx-2 py-1 rounded-md leading-loose px-2 cursor-default"
            @click="clickModuleList(module.id)"
          >
            {{ module.name }}
          </div>
        </div>
      </div>
      <div
        class="my-2 bg-zinc-300/40 text-sm rounded-md leading-loose mx-2 min-h-40"
      >
        <div class="text-center my-2 font-bold">
          模块信息
        </div>
        <div v-if="selectedModuleInList !== null">
          <div class="text-xs my-1 mx-2">
            模块ID：{{ moduleMap.get(selectedModuleInList).id }}
          </div>
          <div class="text-xs my-1 mx-2">
            模块版本：{{ moduleMap.get(selectedModuleInList).version }}
          </div>
          <div class="text-xs my-1 mx-2">
            模块名称：{{ moduleMap.get(selectedModuleInList).name }}
          </div>
          <div class="text-xs my-1 mx-2">
            模块描述：{{ moduleMap.get(selectedModuleInList).description }}
          </div>
        </div>
      </div>
      <div />
    </div>
    <div class="center">
      <div class="flex flex-col h-full">
        <div class="my-2 pb-2 bg-zinc-300/40 text-sm rounded-md leading-loose mx-2 flex-auto flex flex-col">
          <div
            :key="centerKey"
            class="text-center my-2 font-bold"
          >
            动作流
          </div>
          <div class="py-1 flex-auto scroll">
            <div
              v-for="(action, index) in workflowConstructor.data.program"
              :key="index"
              :class="{ select: selectedActionInFlow === index }"
              class="leading-loose mx-2 my-1 px-2 py-1 bg-white hover:bg-blue-200 rounded-md my-1 text-sm cursor-default text-xs"
              @click="clickActionFlow(index)"
            >
              {{ action.name }} | {{ moduleMap.get(action.id).name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right flex flex-col">
      <div class="my-2 pb-2 px-2 bg-zinc-300/40 text-sm rounded-md leading-loose mx-2 flex-auto overflow-y-auto">
        <div class="text-center my-2 font-bold">
          动作信息
        </div>
        <div v-if="curAction !== null">
          <div class="text-sm">
            动作名：
          </div>
          <input
            v-model="curAction.name"
            class="action-input"
          >

          <div
            v-for="(avalue, aname, aindex) in curAction.args"
            :key="aindex"
          >
            <div>输入参数{{ aname }}:</div>
            <input
              v-model="curAction.args[aname]"
              class="action-input"
              type="text"
            >
          </div>

          <div
            v-for="(pvalue, pname, pindex) in curAction.param"
            :key="pindex"
          >
            <div>变量参数{{ pname }}:</div>
            <input
              v-model="curAction.param[pname]"
              class="action-input"
              type="text"
            >
          </div>

          <div>返回变量:</div>
          <input
            v-model="curAction.rtns"
            class="action-input"
            type="text"
          >
        </div>
      </div>
      <div class="control my-2 pb-2 bg-zinc-300/40 text-sm rounded-md leading-loose mx-2">
        <div class="text-center my-2 font-bold">
          控制
        </div>
        <div class="buttons grid grid-cols-2">
          <button
            :class="{ disable: selectedModuleInList === null }"
            class="default-btn"
            @click="clickAddButton()"
          >
            添加
          </button>
          <button
            :class="{ disable: selectedActionInFlow === null }"
            class="default-btn"
            @click="clickDelButton()"
          >
            删除
          </button>
          <button
            :class="{ disable: selectedActionInFlow === null }"
            class="default-btn"
            @click="clickMoveUp()"
          >
            上移
          </button>
          <button
            :class="{ disable: selectedActionInFlow === null }"
            class="default-btn"
            @click="clickMoveDown()"
          >
            下移
          </button>
          <button
            class="default-btn bg-red-300"
            @click="clickRunButton()"
          >
            运行
          </button>
          <button
            class="default-btn"
            @click="clickResetButton()"
          >
            重置
          </button>
          <button
            class="default-btn"
            @click="clickStatusButton()"
          >
            状态
          </button>
          <button
            class="default-btn"
            @click="clickSaveButton()"
          >
            保存
          </button>
          <button
            class="default-btn"
            @click="clickLoadButton()"
          >
            加载
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rpa-flow {
  @apply h-100vh w-100vw;
  @apply flex;
}

.left, .center, .right {
  @apply w-full;
}

.default-btn {
  @apply rounded-md px-6 py-1 my-1 mx-2 text-sm bg-white shadow-md;
  @apply hover:bg-blue-300
}

.select {
  @apply bg-blue-300 hover:bg-blue-300;
}

.disable {
  @apply bg-zinc-100 text-zinc-400 hover:bg-zinc-100
  @apply cursor-not-allowed pointer-events-none
}

.scroll {
  max-height: 30rem;
  overflow: auto;
  @apply overflow-y-auto;
}

.action-input {
  @apply border-none text-xs py-1 px-2 w-full rounded-md
}
</style>
