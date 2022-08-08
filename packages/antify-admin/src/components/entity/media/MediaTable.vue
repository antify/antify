<script
  lang="ts"
  setup
>
import { ANT_ROW_TYPES } from '@antify/antify-ui';
import { TableHeader } from '@antify/antify-ui/dist/types/TableHeader.type';
import TenantLink from '~~/components/fields/TenantLink.vue';
import { Default } from '~~/glue/api/admin/[tenantId]/media/index.get';

const route = useRoute();
const { $toaster } = useNuxtApp();

const emit = defineEmits(['reloadMedia']);
const props = defineProps<{
  showDelete?: boolean;
  showPreview?: boolean;
  mediaFiles?: Default[];
}>();

const tableHeaders = ref<Array<TableHeader>>([]);
const deleteDialogActive = ref(false);
const toDelete = ref('');

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

if (props.showPreview) {
  tableHeaders.value.push({
    title: 'Bild',
    identifier: 'url',
    type: ANT_ROW_TYPES.IMAGE,
    rowClassList: 'w-6 overflow-hidden overflow-ellipsis h-full',
    headerClassList: 'sr-only',
  });
}

tableHeaders.value.push({
  title: 'Name',
  identifier: 'title',
  type: ANT_ROW_TYPES.SLOT,
});

function onDeleteMedia(id) {
  deleteDialogActive.value = true;
  toDelete.value = id;
}

async function deleteMedia() {
  if (!toDelete.value) {
    return;
  }

  await useFetch(`/api/admin/:tenantId/media/${toDelete.value}`, {
    ...useDefaultFetchOpts(),
    method: 'DELETE',
  });

  $toaster.toastDeleted();
  deleteDialogActive.value = false;
  toDelete.value = '';

  emit('reloadMedia');
}
</script>

<template>
  <div>
    <AntTable
      class="w-full"
      :headers="tableHeaders"
      :data="_data || []"
    >
      <template #cellContent="{ elem }">
        <TenantLink
          class="block w-full h-full"
          data-cy="media-link"
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
            <DeleteButton
              data-cy="media-delete"
              @click="() => onDeleteMedia(elem.id)"
              size="small"
            >
              Löschen
            </DeleteButton>
          </div>
        </td>
      </template>
    </AntTable>

    <AntModal
      v-model:active="deleteDialogActive"
      title="Datei löschen"
    >
      <div data-cy="media-delete-dialog-text">
        Sind sie sicher das Sie diese Datei wirklich, sicherlich und
        unwiederruflich löschen wollen?
      </div>

      <template #buttons>
        <AntButton
          primary
          @click="deleteDialogActive = false"
        >
          Abbrechen
        </AntButton>

        <DeleteButton
          data-cy="media-delete-button"
          label="Löschen"
          @click="deleteMedia"
        />
      </template>
    </AntModal>
  </div>
</template>
