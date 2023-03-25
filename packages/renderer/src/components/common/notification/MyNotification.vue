<script lang="ts" setup>
import { notificationInstances as notifications } from '/@/components/common/notification/index'
import Info from '@material-design-icons/svg/round/info.svg'
import Warning from '@material-design-icons/svg/round/warning.svg'
import Error from '@material-design-icons/svg/round/error.svg'
import Success from '@material-design-icons/svg/round/verified.svg'
</script>

<template>
  <div
    class="bkg pointer-events-none"
    fixed="~"
    inset="x-0 t-0"
    m="x-auto"
    w="80"
    z="100"
  >
    <div
      v-for="item in notifications"
      :key="item.id"
      :class="{
        info: item.type === 'info',
        error: item.type === 'error',
        success: item.type === 'success',
        warning: item.type === 'warning',
      }"
      class="notification"
      flex="~ items-center gap-2"
      m="y-2"
      p="3"
      rounded="xl"
      shadow="lg"
    >
      <div class="notification-icon">
        <Success v-if="item.type === 'success'" />
        <Info v-if="item.type === 'info'" />
        <Warning v-if="item.type === 'warning'" />
        <Error v-if="item.type === 'error'" />
      </div>
      <div class="notification-msg">
        {{ item.message }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.notification {
  .notification-icon {
    & {
      @apply w-6 h-6;
      @apply flex items-center justify-center;
    }

    svg {
      @apply transform scale-90;
    }

    .notification-msg {
      @apply text-blue-300;
      p {
        @apply text-blue-300;
      }
    }

  }
}

.success {
  @apply text-green-500;
  & {
    @apply bg-green-200;
  }

  svg {
    @apply fill-green-500;
  }
}

.info {
  @apply text-neutral-500;
  & {
    @apply bg-neutral-200;
  }

  svg {
    @apply fill-neutral-500;
  }
}

.warning {
  @apply text-orange-500;
  & {
    @apply bg-orange-200
  }

  svg {
    @apply fill-orange-500;
  }
}

.error {
  @apply text-red-500;
  & {
    @apply bg-red-200
  }

  svg {
    @apply fill-red-500;
  }
}
</style>
