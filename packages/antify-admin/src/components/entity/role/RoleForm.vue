<script lang="ts" setup>
import { Checkbox } from '@antify/antify-ui/dist/types/Checkbox.type';
import { Default as RoleDefault } from '~~/glue/api/backoffice/[tenantId]/roles/[roleId].get';

type Permission = {
  id: string;
  name: string;
};
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
      allPermissions.value.push(permission.id);
      return {
        label: permission.name,
        value: permission.id,
      };
    }) || []
  );
});
</script>

<template>
  <AntForm @submit.prevent="() => $emit('save')">
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
