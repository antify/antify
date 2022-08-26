<script setup lang="ts">
import type { SelectOption } from '@antify/antify-ui/dist/types/SelectOption.type';

const tenants = useTenantState();
const route = useRoute();
const currentTenant = useCurrentTenantState();

const tenantId = computed({
  get: () => {
    return currentTenant.value.id;
  },
  set: (val) => {
    currentTenant.value = tenants.value.find((t) => t.id === val);

    navigateTo({
      ...useRoute(),
      ...{ params: { tenantId: val } },
    });
  },
});

const options = ref<SelectOption[]>([]);

tenants.value.forEach((tenant) => {
  options.value.push({
    label: tenant.name,
    value: tenant.id,
  });
});
</script>

<template>
  <AntSelect
    v-model:value="tenantId"
    :options="options"
    data-cy="CurrentTenantSelectField"
  />
</template>
