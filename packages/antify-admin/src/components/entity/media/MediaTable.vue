<script lang="ts" setup>
import { ROW_TYPES } from '@antify/antify-ui';
import { TableHeader } from '@antify/antify-ui/dist/types/TableHeader.type';
import TenantLink from '~~/components/fields/TenantLink.vue';
import { Default } from '~~/glue/api/admin/[tenantId]/media/index.get';

const { $toaster } = useNuxtApp();

const emit = defineEmits(['reloadMedia']);

const route = useRoute();
const props = defineProps<{
  showDelete?: boolean;
  showPreview?: boolean;
  mediaFiles?: Default[];
}>();

const tableHeaders: TableHeader[] = [];

if (props.showPreview) {
  tableHeaders.push({
    title: 'Bild',
    identifier: 'url',
    type: ROW_TYPES.IMAGE,
    rowClassList: 'w-6 overflow-hidden overflow-ellipsis h-full',
    headerClassList: 'sr-only',
  });
}

tableHeaders.push({
  title: 'Name',
  identifier: 'title',
  type: ROW_TYPES.SLOT,
});

const onDeleteMedia = async (mediaId: string) => {
  await useFetch(`/api/admin/:tenantId/media/${mediaId}`, {
    ...useDefaultFetchOpts(),
    method: 'DELETE',
  });

  $toaster.toastCreated();

  emit('reloadMedia');
};

const _data = computed(() => {
  return props.mediaFiles?.map((file) => {
    if (route.params?.mediaId === file.id) {
      return {
        ...file,
        active: true,
      };
    }

    return {
      ...file,
      active: false,
    };
  });
});
</script>

<template>
  <AntTable class="w-full" :headers="tableHeaders" :data="_data || []">
    <template #cellContent="{ elem }">
      <TenantLink
        class="block w-full h-full"
        :to="{
          name: 'admin-tenantId-media-mediaId',
          params: { mediaId: elem.id },
          query: { ...route.query },
        }"
      >
        {{ elem.title }}
      </TenantLink>
    </template>

    <template #rowLastCell="{ elem }">
      <td
        v-if="showDelete"
        class="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
      >
        <div class="flex items-center h-full justify-end">
          <DeleteButton @click="() => onDeleteMedia(elem.id)" size="small">
            Löschen
          </DeleteButton>
        </div>
      </td>
    </template>
  </AntTable>
</template>
