import {v1 as uuidv1} from 'uuid';
import {ref} from 'vue';

interface NotificationInstance {
  id: string,
  type: 'success' | 'info' | 'warning' | 'error',
  message: string,
  timeout: number,
}

export const notificationInstances = ref<Array<NotificationInstance>>([]);

export function notify(
  message: NotificationInstance['message'],
  type?: NotificationInstance['type'],
  timeout?: NotificationInstance['timeout']) {
  const instance: NotificationInstance = {
    id: uuidv1(),
    type: type ?? 'info',
    message,
    timeout: timeout ?? 5000,
  };
  notificationInstances.value.push(instance);
  setTimeout(() => {
    const index = notificationInstances.value.findIndex((e) => e.id === instance.id);
    if (index > -1) {
      notificationInstances.value.splice(index, 1);
    }
  }, instance.timeout);
  return instance.id;
}

