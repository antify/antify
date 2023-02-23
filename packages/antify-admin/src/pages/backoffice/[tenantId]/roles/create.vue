<script setup lang="ts">
import TenantLink from '~~/components/fields/TenantLink.vue';
import { useContextHeader, useTenantHeader } from '@antify/context';
import RoleForm from '~~/components/entity/role/RoleForm';

const { $toaster } = useNuxtApp();
const saving = ref(true);
const role = ref<{
  id?: string;
  name: string;
  isAdmin: boolean;
  permissions: string[];
}>({
  name: '',
  isAdmin: false,
  permissions: [],
});

const {
  data: permissions,
  pending,
  error,
} = await useFetch('/api/pages/backoffice/tenantId/roles/create', {
  headers: {
    // TODO:: remove with nuxt 3.2.0
    ...useRequestHeaders(),
    ...useContextHeader('tenant'),
    ...useTenantHeader(useRoute().params.tenantId as string),
  },
});

if (error.value) {
  throw createError(error.value.data);
}

async function onSave() {
  saving.value = true;

  const { error } = await useFetch(
    `/api/pages/backoffice/tenantId/roles/create`,
    {
      method: 'post',
      body: role.value,
      headers: {
        ...useContextHeader('tenant'),
        ...useTenantHeader(useRoute().params.tenantId as string),
      },
    }
  );

  if (error.value) {
    throw createError({ ...error.value.data, fatal: true });
  }

  saving.value = false;

  $toaster.toastUpdated();

  await navigateTo(
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
  <AntContent>
    <template #head>
      <AntHeader>Rolle erstellen</AntHeader>
    </template>

    <template #body>
      <RoleForm
        :role="role"
        :permissions="permissions"
        :loading="pending"
        id="create-role-form"
        @save="onSave"
      />
    </template>

    <template #footer>
      <AntButton>
        <TenantLink :to="{ name: 'backoffice-tenantId-roles' }"
          >Zurück</TenantLink
        >
      </AntButton>

      <AntButton
        :primary="true"
        type="submit"
        form="create-role-form"
      >
        Speichern
      </AntButton>
    </template>
  </AntContent>
</template>
