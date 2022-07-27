<script setup lang="ts">
import { Response } from '~~/glue/api/admin/[tenantId]/media/index.get';
import Media from '~~/components/entity/media/Media.vue';

const file = ref({});
const loading = ref(false);
const { $toaster } = useNuxtApp();
const route = useRoute();
const { data, refresh: reloadAllMedia } = await useFetch<Response>(
  () => `/api/admin/:tenantId/media?search=${route.query.search || ''}`,
  useDefaultFetchOpts()
);

const onSelectFile = async (event) => {
  loading.value = true;
  let formData = new FormData();

  for (let i = 0; i < event.target.files.length; i++) {
    formData.append(`file-${i}`, event.target.files[i]);
  }

  await useFetch('/api/admin/:tenantId/media', {
    ...useDefaultFetchOpts(),
    method: 'POST',
    body: formData,
  });

  $toaster.toastCreated();

  await reloadAllMedia();

  loading.value = false;
};
</script>

<template>
  <AntContent>
    <template #head>
      <AntHeader>Mediatheke</AntHeader>

      <AntUpload
        v-model:value="file"
        :loading="loading"
        @change="onSelectFile"
        label-style="cursor-pointer flex space-x-4 items-center text-gray-400"
      >
        <template #preview><span></span></template>
        <template #label>
          <CreateButton label="Hochladen" class="pointer-events-none" />
        </template>
      </AntUpload>
    </template>

    <template #body>
      <Media :media-files="data.default" @reload-media="reloadAllMedia" />
    </template>
  </AntContent>
</template>
