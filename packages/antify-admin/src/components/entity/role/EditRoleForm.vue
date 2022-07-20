<script lang="ts" setup>
import { Checkbox } from '@antify/antify-ui/dist/types/Checkbox.type';
import TenantLink from '~~/components/fields/TenantLink.vue';

type Role = {
  id: string;
  name: string;
  isAdmin: boolean;
  permissions: string[];
};
type Permission = {
  id: string;
  name: string;
};

const { $toaster } = useNuxtApp();
const { role, permissions } = defineProps<{
  role: Role;
  permissions: Permission[];
}>();
const onSubmit = () => (role.id ? onUpdate() : onCreate());
const onUpdate = async () => {
  const { data: response } = await useFetch(`/api/roles/${role.id}`, {
    ...useDefaultFetchOpts(),
    ...{
      method: 'PUT',
      body: role,
    },
  });

  // TODO:: override role with response data
  $toaster.toastUpdated();
};
const onCreate = async () => {
  const { data: response } = await useFetch(`/api/roles/roles`, {
    ...useDefaultFetchOpts(),
    ...{
      method: 'POST',
      body: role,
    },
  });

  // TODO:: override role with response data
  $toaster.toastCreated();
};

const allPermissions = ref([]);
const checkboxes = computed<Checkbox[]>(() => {
  return permissions.map((permission) => {
    allPermissions.value.push(permission.id);
    return {
      label: permission.name,
      value: permission.id,
    };
  });
});
</script>

<template>
  <AntForm @submit.prevent="onSubmit">
    <AntInput v-model:value="role.name" :label="'Rollen Bezeichnung'" />

    <AntCheckboxWidget
      v-if="role.isAdmin"
      label="Rechte dieser Rolle"
      :value="allPermissions"
      :checkboxes="checkboxes"
    >
    </AntCheckboxWidget>

    <AntCheckboxWidget
      v-else
      label="Rechte dieser Rolle"
      v-model:value="role.permissions"
      :checkboxes="checkboxes"
    >
    </AntCheckboxWidget>

    <template #footer>
      <AntButton>
        <TenantLink :to="{ name: 'admin-tenantId-roles' }">Zurück</TenantLink>
      </AntButton>
      <AntButton :primary="true" type="submit">Speichern</AntButton>
    </template>
  </AntForm>
</template>
