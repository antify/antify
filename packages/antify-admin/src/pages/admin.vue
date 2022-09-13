<script setup lang="ts">
import { Response as GetResponse } from '~~/glue/api/tenants/[tenantDetailId].get';
const { $auth } = useNuxtApp();

const me = useMeState();
const { data: userResponseData } = await useFetch(
  `/api/global/me`,
  useDefaultFetchOpts()
);

if (!userResponseData.value?.default) {
  await $auth.logout();
}

me.value = userResponseData.value.default;

const tenants = useTenantState();
const tenant = useCurrentTenantState();
const { data: tennantsResponseData } = await useFetch(
  `/api/global/tenants`,
  useDefaultFetchOpts()
);
tenants.value = tennantsResponseData.value.default.data;

if (!useRoute().params.tenantId) {
  if (tenants.value.length <= 0) {
    // TODO:: redirect to "Create first tenant" page or something else
    await navigateTo({ name: 'login' });
  }

  if (
    !tenants.value.some((tenant) => tenant.id === useRoute().params.tenantId)
  ) {
    const { data: currentTenantResponse } = await useFetch<GetResponse>(
      `/api/tenants/${tenants.value[0].id}`,
      useDefaultFetchOpts()
    );
    tenant.value = currentTenantResponse.value.default;

    // User has no access to the current tenant - redirect him to another one.
    // TODO:: 404 or 403 page
    await navigateTo({
      name: 'admin-tenantId-dashboard',
      params: { tenantId: tenants.value[0].id },
    });
  }
} else {
  const { data: currentTenantResponse } = await useFetch<GetResponse>(
    `/api/tenants/${useRoute().params.tenantId}`,
    useDefaultFetchOpts()
  );
  tenant.value = currentTenantResponse.value.default;
}

definePageMeta({
  middleware: ['auth'],
});
</script>

<template>
  <div>
    <NuxtChild />
  </div>
</template>
