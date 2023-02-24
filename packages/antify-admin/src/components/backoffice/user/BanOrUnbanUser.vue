<script lang="ts" setup>
import { useContextHeader, useTenantHeader } from '@antify/context';

defineProps<{
  userId: string;
  isBanned: boolean;
}>();

const emit = defineEmits(['update:isBanned']);
const saving = ref(false);
const route = useRoute();

async function banUser() {
  saving.value = true;

  const { error } = await useFetch(
    `/api/components/backoffice/user/ban-or-unban-user/${route.params.userId}/ban`,
    {
      method: 'PUT',
      headers: {
        ...useContextHeader('tenant'),
        ...useTenantHeader(route.params.tenantId as string),
      },
    }
  );

  saving.value = false;

  if (error.value) {
    throw createError({ ...error.value.data, fatal: true });
  }

  useNuxtApp().$toaster.toastUpdated();

  emit('update:isBanned', true);
}

async function unbanUser() {
  saving.value = true;

  const { error } = await useFetch(
    `/api/components/backoffice/user/ban-or-unban-user/${route.params.userId}/unban`,
    {
      method: 'PUT',
      headers: {
        ...useContextHeader('tenant'),
        ...useTenantHeader(route.params.tenantId as string),
      },
    }
  );

  saving.value = false;

  if (error.value) {
    throw createError({ ...error.value.data, fatal: true });
  }

  useNuxtApp().$toaster.toastUpdated();

  emit('update:isBanned', false);
}
</script>

<template>
  <AntButton
    v-if="!isBanned"
    label="Ban"
    :disabled="saving"
    @click="banUser"
  />

  <AntButton
    v-else
    label="Unban"
    :disabled="saving"
    @click="unbanUser"
  />
</template>
