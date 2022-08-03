<script setup>
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
    // User has no access to the current tenant - redirect him to another one.
    // TODO:: 404 or 403 page
    await navigateTo({
      name: 'admin-tenantId-dashboard',
      params: { tenantId: tenants.value[0].id },
    });
  }
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
