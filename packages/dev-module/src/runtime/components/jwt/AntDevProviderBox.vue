<script lang='ts' setup>
import { Permission } from '@antify/ant-guard';
// TODO:: fix type import
import { Checkbox } from '@antify/antify-ui/dist/types/Checkbox.type';

const emit = defineEmits(['update:providerId', 'update:tenantId', 'update:permissions']);
const props = withDefaults(defineProps<{
  isAdmin: boolean,
  permissions: string[],
  providerId: string,
  tenantId?: string
}>(), {
  permissions: [],
  tenantId: ''
});
const allPermissions = inject<Permission[]>('permissions')
  .map<Checkbox>((item) => ({
    value: item.id,
    label: item.name
  }));
const _permissions = computed({
  get() {
    return props.permissions;
  },
  set(val) {
    emit('update:permissions', val);
  }
});
const _providerId = computed({
  get() {
    return props.providerId;
  },
  set(val) {
    emit('update:providerId', val);
  }
});
const _tenantId = computed({
  get() {
    return props.tenantId;
  },
  set(val) {
    emit('update:tenantId', val);
  }
});
const _isAdmin = computed({
  get() {
    return props.isAdmin;
  },
  set(val) {
    emit('update:isAdmin', val);
  }
});

function selectAll() {
  emit('update:permissions', allPermissions.map((permission) => permission.value));
}
function unselectAll() {
  emit('update:permissions', []);
}
</script>

<template>
  <div class='bg-gray-200 p-2 rounded flex flex-col space-y-2'>
    <div class='flex justify-end'>
      <AntButton @click='() => $emit("remove")'>X</AntButton>
    </div>
    <AntCheckbox label='Admin' v-model:checked='_isAdmin' />
    <AntInput label='Provider ID' v-model:value='_providerId' autofocus />
    <AntInput label='Tenant ID' v-model:value='_tenantId' />
    <div>
      <div class='block text-sm font-medium text-gray-700'>
        Permissions
      </div>
      <div class='mb-2'>
        <AntButton @click='selectAll' size='small'>Select all</AntButton>
        <AntButton @click='unselectAll' size='small'>Unselect all</AntButton>
      </div>
      <AntCheckboxWidget
        :checkboxes='allPermissions'
        v-model:value='_permissions'
      ></AntCheckboxWidget>
    </div>
  </div>
</template>
