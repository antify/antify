<script setup lang="ts">
// const currentTenantId = useCookie(CURRENT_TENANT_COOKIE_KEY);

// if (
//   typeof useRoute().params.tenantId === 'string' &&
//   currentTenantId.value !== useRoute().params.tenantId
// ) {
//   currentTenantId.value = useRoute().params.tenantId as string;
// }
</script>

<template>
  <NuxtLayout name="backoffice">
    <NuxtPage />
  </NuxtLayout>
</template>
