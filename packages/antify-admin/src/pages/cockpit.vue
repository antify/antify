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

definePageMeta({
  middleware: ['auth'],
});
</script>

<template>
  <NuxtLayout name="cockpit">
    <NuxtPage />
  </NuxtLayout>
</template>
