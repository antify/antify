<script lang="ts" setup>
import { useContextHeader, useTenantHeader } from '@antify/context';

const props = defineProps<{
  userId: string;
}>();
const modalActive = ref(false);

async function deleteUser() {
  const { error } = await useFetch(
    `/api/components/backoffice/user/remove-user/${props.userId}`,
    {
      method: 'delete',
      headers: {
        ...useContextHeader('tenant'),
        ...useTenantHeader(useRoute().params.tenantId as string),
      },
    }
  );

  if (error.value) {
    throw createError({ ...error.value.data, fatal: true });
  }

  useNuxtApp().$toaster.toastDeleted();
  modalActive.value = false;

  useRouter().push({ name: 'backoffice-tenantId-users' });
}
</script>

<template>
  <div>
    <DeleteButton
      label="Remove user"
      @click="modalActive = true"
    />

    <ClientOnly>
      <Teleport to="body">
        <AntModal
          v-model:active="modalActive"
          title="Remove user"
        >
          <div>Do you relay want to remove the user from this tenant?</div>

          <template #buttons>
            <AntButton
              primary
              @click="modalActive = false"
            >
              Cancel
            </AntButton>

            <DeleteButton
              label="Remove user"
              @click="deleteUser"
            />
          </template>
        </AntModal>
      </Teleport>
    </ClientOnly>
  </div>
</template>
