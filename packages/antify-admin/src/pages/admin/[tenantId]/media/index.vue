<script setup lang="ts">
import TenantLink from "~~/components/fields/TenantLink.vue";
import { ROW_TYPES } from "@antify/antify-ui";
import { Response } from "~~/glue/api/admin/[tenantId]/media/index.get";
import { TableHeader } from "@antify/antify-ui/dist/types/TableHeader.type";

const { data, refresh: reloadAllMedia } = await useFetch<Response>(
  "/api/admin/:tenantId/media",
  useDefaultFetchOpts()
);

const tableHeaders: TableHeader[] = [
  {
    title: "Bild",
    identifier: "url",
    type: ROW_TYPES.IMAGE,
    rowClassList: 'w-6'
  },
  {
    title: "Name",
    identifier: "title",
    type: ROW_TYPES.SLOT,
  },
];

const file = ref({});
const { $toaster } = useNuxtApp();
const onSelectFile = async (event) => {
  let formData = new FormData();

  for (let i = 0; i < event.target.files.length; i++) {
    formData.append(`file-${i}`, event.target.files[i]);
  }

  await useFetch('/api/admin/:tenantId/media', { ...useDefaultFetchOpts(), method: 'POST', body: formData });

  $toaster.toastCreated();

  reloadAllMedia();
}
const onDeleteMedia = async (mediaId: string) => {
  await useFetch(`/api/admin/:tenantId/media/${mediaId}`, { ...useDefaultFetchOpts(), method: 'DELETE' });

  $toaster.toastCreated();

  reloadAllMedia();
}
</script>

<template>
  <AntContent>
    <template #head>
      <AntHeader>Mediatheke</AntHeader>

      <!-- TODO:: Replace with a button -->
      <AntUpload v-model:value="file" label="Hochladen" :show-preview="true" @change="onSelectFile" />
    </template>

    <template #body>
      <AntTable :headers="tableHeaders" :data="(data.default || [])">
        <template #cellContent="{ elem }">
          <TenantLink :to="{
            name: 'admin-tenantId-media-mediaId',
            params: { mediaId: elem.id },
          }">
            {{ elem.title }}
          </TenantLink>
          -
          <AntButton @click="() => onDeleteMedia(elem.id)">Löschen</AntButton>
        </template>
      </AntTable>
    </template>
  </AntContent>
</template>
