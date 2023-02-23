<script setup lang="ts">
import RoleTable from '~~/components/entity/role/RoleTable.vue';
import TenantLink from '~~/components/fields/TenantLink.vue';
import RoleForm from '~~/components/entity/role/RoleForm';
import DeleteRole from '~~/components/entity/role/DeleteRole';
import { AntTabsType } from '@antify/antify-ui';
import { useContextHeader, useTenantHeader } from '@antify/context';

const { $toaster } = useNuxtApp();
const saving = ref(false);
const search = ref('');
const tabs = ref<AntTabsType[]>([
  {
    name: 'Stammdaten',
    current: true,
    to: '',
  },
]);

const { data, error, pending } = await useFetch(
  `/api/pages/backoffice/tenantId/roles/${useRoute().params.roleId}`,
  {
    headers: {
      // TODO:: remove with nuxt 3.2.0
      ...useRequestHeaders(),
      ...useContextHeader('tenant'),
      ...useTenantHeader(useRoute().params.tenantId as string),
    },
  }
);

if (error.value) {
  throw createError(error.value.data);
}

if (data.value?.notFound) {
  await navigateTo(
    useBuildTenantLink(
      {
        name: 'backoffice-tenantId-roles',
      },
      useRoute()
    )
  );
}

async function onSave() {
  saving.value = true;

  const { data: roleData } = await useFetch(
    `/api/pages/backoffice/tenantId/roles/${data.value.role.id}`,
    {
      method: 'PUT',
      body: data.value.role,
      headers: {
        ...useContextHeader('tenant'),
        ...useTenantHeader(useRoute().params.tenantId as string),
      },
    }
  );

  saving.value = false;

  if (roleData.value.notFound) {
    $toaster.toastError(
      'Role does not exists anymore. Maybe an other user deleted it.'
    );

    return await navigateTo(
      useBuildTenantLink(
        {
          name: 'backoffice-tenantId-roles',
        },
        useRoute()
      )
    );
  }

  $toaster.toastUpdated();

  data.value.role = roleData.value;
}

function onRoleDeleted() {
  useRouter().push(
    useBuildTenantLink(
      {
        name: 'backoffice-tenantId-roles',
      },
      useRoute()
    )
  );
}
</script>

<template>
  <div>
    <AntDualContent>
      <template #mainHead>
        <AntTabs :tabs="tabs" />
        <DeleteRole
          :role-id="$route.params.roleId"
          @submit="onRoleDeleted"
        />
      </template>

      <template #mainBody>
        <RoleForm
          v-if="data?.role && data?.permissions"
          :role="data.role"
          :permissions="data.permissions"
          :loading="pending"
          id="edit-role-form"
          @save="onSave"
        />
      </template>

      <template #mainFooter>
        <AntButton>
          <TenantLink :to="{ name: 'backoffice-tenantId-roles' }">
            Back
          </TenantLink>
        </AntButton>

        <AntButton
          :primary="true"
          type="submit"
          form="edit-role-form"
        >
          Save
        </AntButton>
      </template>

      <template #asideHead>
        <AntInput
          v-model:value="search"
          placeholder="Search"
        />
      </template>

      <template #asideBody><RoleTable /></template>
    </AntDualContent>
  </div>
</template>
