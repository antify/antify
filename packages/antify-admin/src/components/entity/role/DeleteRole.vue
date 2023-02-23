<script setup lang="ts">
import { useContextHeader, useTenantHeader } from '@antify/context';

const props = defineProps<{
  roleId: string;
}>();
const emit = defineEmits(['submit']);

const { $toaster } = useNuxtApp();
const deleteDialogActive = ref(false);

async function onDelete() {
  const { data, error } = await useFetch(
    `/api/components/entity/role/delete-role/${props.roleId}`,
    {
      method: 'DELETE',
      headers: {
        ...useContextHeader('tenant'),
        ...useTenantHeader(useRoute().params.tenantId as string),
      },
    }
  );

  if (error.value) {
    throw createError({ ...error.value.data, fatal: true });
  }

  if (data.value?.notDeleteAble) {
    $toaster.toastError(data.value.notDeleteAble);

    deleteDialogActive.value = false;

    return;
  }

  deleteDialogActive.value = false;
  $toaster.toastDeleted();

  emit('submit');
}
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <AntModal
        v-model:active="deleteDialogActive"
        title="Delete role"
      >
        <div>Are you sure to delete this role?</div>

        <template #buttons>
          <AntButton
            primary
            @click="deleteDialogActive = false"
          >
            Cancel
          </AntButton>

          <DeleteButton
            label="Delete"
            @click="onDelete"
          />
        </template>
      </AntModal>
    </Teleport>
  </ClientOnly>

  <DeleteButton @click="deleteDialogActive = true">Delete </DeleteButton>
</template>
