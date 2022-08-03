<script
  lang="ts"
  setup
>
import { Checkbox } from '@antify/antify-ui/dist/types/Checkbox.type';
import { Default as RoleDefault } from '~~/glue/api/admin/[tenantId]/roles/[roleId].get';
import { permissions } from '../../../server/datasources/static/permissions';

type Permission = {
  id: string;
  name: string;
};

const { $toaster } = useNuxtApp();
const props = defineProps<{
  role: RoleDefault;
  permissions: Permission[];
  loading?: boolean;
}>();

const saving = ref(false);
const allPermissions = ref([]);

const checkboxes = computed<Checkbox[]>(() => {
  return (
    props.permissions?.map((permission) => {
      console.log('Perm', permission);
      allPermissions.value.push(permission.id);

      return {
        label: permission.name,
        value: permission.id,
      };
    }) || []
  );
});

function onSubmit() {
  return props.role.id ? onUpdate() : onCreate();
}

async function onUpdate() {
  saving.value = true;

  await useFetch(`/api/roles/${props.role.id}`, {
    ...useDefaultFetchOpts(),
    ...{
      method: 'PUT',
      body: props.role,
    },
  });

  // TODO:: override role with response data
  $toaster.toastUpdated();
  saving.value = false;
}

async function onCreate() {
  saving.value = true;

  await useFetch(`/api/roles/roles`, {
    ...useDefaultFetchOpts(),
    ...{
      method: 'POST',
      body: props.role,
    },
  });

  // TODO:: go to edit page
  $toaster.toastCreated();
  saving.value = false;
}
</script>

<template>
  <AntForm @submit.prevent="onSubmit">
    <AntInput
      v-model:value="role.name"
      :label="'Rollen Bezeichnung'"
      :loading="loading"
      :disabled="saving"
    />

    <AntCheckboxWidget
      v-if="(role as RoleDefault).isAdmin"
      label="Rechte dieser Rolle"
      v-model:value="allPermissions"
      :checkboxes="checkboxes"
      disabled="true"
      :loading="loading"
    />

    <AntCheckboxWidget
      v-else
      label="Rechte dieser Rolle"
      v-model:value="(role as RoleDefault).permissions"
      :checkboxes="checkboxes"
      :loading="loading"
      :disabled="saving"
    />
  </AntForm>
</template>
