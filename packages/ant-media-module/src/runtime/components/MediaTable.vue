<script lang="ts" setup>
import { ANT_ROW_TYPES } from '@antify/antify-ui';
import { TableHeader } from '@antify/antify-ui/dist/types/TableHeader.type';
import { LocationAsRelativeRaw } from 'vue-router';

type Media = {
  id: string;
  title: string;
  url: string;
};

const route = useRoute();
const { $toaster } = useNuxtApp();
const jwt = useCookie('antt').value;

const emit = defineEmits(['reloadMedia']);
const props = defineProps<{
  getDetailRoute: (mediaId: string) => LocationAsRelativeRaw;
  showDelete?: boolean;
  showPreview?: boolean;
  mediaFiles?: Media[];
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
    title: 'Image',
    identifier: 'url',
    type: ANT_ROW_TYPES.IMAGE,
    rowClassList: 'w-6 overflow-hidden overflow-ellipsis h-full',
    headerClassList: 'sr-only',
  });
}

tableHeaders.value.push({
  title: 'Title',
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

  await useFetch(`/api/backoffice/:tenantId/media/${toDelete.value}`, {
    method: 'DELETE',
    headers: {
      Authorization: jwt,
    },
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
        <NuxtLink
          :to="getDetailRoute(elem.id)"
          class="block w-full h-full"
          data-cy="media-link"
          >{{ elem.title }}</NuxtLink
        >
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
              Delete
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
        Sind sie sicher das Sie diese Datei wirklich löschen wollen?
      </div>

      <template #buttons>
        <AntButton
          primary
          @click="deleteDialogActive = false"
        >
          Cancel
        </AntButton>

        <DeleteButton
          data-cy="media-delete-button"
          label="Delete"
          @click="deleteMedia"
        />
      </template>
    </AntModal>
  </div>
</template>
