<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
});

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
</script>

<template>
  <NuxtLayout name="cockpit">
    <NuxtPage />
  </NuxtLayout>
</template>
