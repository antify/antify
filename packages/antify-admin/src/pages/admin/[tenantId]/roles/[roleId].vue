<script
  setup
  lang="ts"
>
import RoleTable from '~~/components/entity/role/RoleTable.vue';
import TenantLink from '~~/components/fields/TenantLink.vue';
import { AntTabsType } from '@antify/antify-ui';
import { Response } from '../../../../glue/api/admin/[tenantId]/roles/[roleId].get';
import { Response as DeleteResponse } from '../../../../glue/api/admin/[tenantId]/roles/[roleId].delete';

const { $toaster } = useNuxtApp();
const route = useRoute();

const search = ref('');
const deleteDialogActive = ref(false);
const tabs = ref<AntTabsType[]>([
  {
    name: 'Stammdaten',
    current: true,
    to: '',
  },
]);

const { data: role } = await useFetch<Response>(
  `/api/roles/${route.params.roleId}`,
  useDefaultFetchOpts()
);
const { data: permissions } = await useFetch(
  '/api/roles/permissions',
  useDefaultFetchOpts()
);

async function onDelete() {
  const { data } = await useFetch<DeleteResponse>(
    `/api/roles/${route.params.roleId}`,
    {
      ...useDefaultFetchOpts(),
      method: 'DELETE',
    }
  );
  console.log('error', data);

  if (data.value && data.value.badRequest) {
    console.log('error', data);
    $toaster.toastError(
      'Eine Rolle kann nur gelöscht werden wenn sie keinem Benutzer zugewiesen ist.'
    );
    deleteDialogActive.value = false;
    return;
  }

  deleteDialogActive.value = false;
  $toaster.toastDeleted();

  await navigateTo({
    name: 'admin-tenantId-roles',
    params: {
      roleId: route.params.roleId,
      tenantId: route.params.tenantId,
    },
  });
}
</script>

<template>
  <div>
    <AntDualContent>
      <template #mainHead>
        <AntTabs :tabs="tabs" />

        <DeleteButton
          @click="deleteDialogActive = true"
          v-if="!role.isAdmin"
        >
          Löschen
        </DeleteButton>
      </template>

      <template #mainBody>
        <EntityRoleEditRoleForm
          :role="role"
          :permissions="permissions"
          id="edit-role-form"
        />
      </template>

      <template #mainFooter>
        <AntButton>
          <TenantLink :to="{ name: 'admin-tenantId-roles' }">Zurück</TenantLink>
        </AntButton>

        <AntButton
          :primary="true"
          type="submit"
          form="edit-role-form"
        >
          Speichern
        </AntButton>
      </template>

      <template #asideHead>
        <AntInput
          v-model:value="search"
          placeholder="Suche"
        />
      </template>

      <template #asideBody> <RoleTable /> </template>
    </AntDualContent>

    <AntModal
      v-model:active="deleteDialogActive"
      title="Rolle löschen"
    >
      <div>
        Sind sie sicher das Sie diese Rolle wirklich, sicherlich und
        unwiederruflich löschen wollen?
      </div>

      <template #buttons>
        <AntButton
          primary
          @click="deleteDialogActive = false"
        >
          Abbrechen
        </AntButton>

        <DeleteButton
          label="Löschen"
          @click="onDelete"
        />
      </template>
    </AntModal>
  </div>
</template>
