<script setup lang='ts'>
definePageMeta({
  middleware: ['auth']
});

const me = useMeState();
const { data, error } = await useFetch(
  `/api/global/me`,
  useDefaultFetchOpts()
);

if (error.value) {
  throw createError({ ...error.value, fatal: true });
}

me.value = data.value.default;
</script>

<template>
  <NuxtLayout name='cockpit'>
    <NuxtPage />
  </NuxtLayout>
</template>
