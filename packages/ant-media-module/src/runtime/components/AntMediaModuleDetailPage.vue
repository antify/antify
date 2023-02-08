<script setup lang="ts">
// import { validator as baseValidator } from '~~/glue/api/backoffice/[tenantId]/media/[mediaId].put';
import MediaTable from './MediaTable.vue';
import { AntTabsType } from '@antify/antify-ui';
import { createError } from 'h3';
import { LocationAsRelativeRaw } from 'vue-router';

const route = useRoute();
const router = useRouter();
const props = defineProps<{
  provider: string,
  getListingRoute: () => LocationAsRelativeRaw;
  getDetailRoute: (mediaId: string) => LocationAsRelativeRaw;
}>();
const search = ref(route.query?.search || '');
const { $toaster } = useNuxtApp();
const errors = ref([]);
const loading = ref<Boolean>(true);
const saving = ref<Boolean>(false);
// const validator = ref(baseValidator);
const deleteDialogActive = ref(false);
const tabs = ref<AntTabsType[]>([
  {
    name: 'Main data',
    current: true,
    to: '',
  },
]);
const jwt = useCookie('antt').value;

const _search = computed({
  get() {
    return search.value;
  },
  set(val) {
    router.push({
      name: 'backoffice-tenantId-media',
      query: {
        ...route.query,
        search: val,
      },
    });
  },
});

// TODO:: rebuild to ssr loading
const media = ref({ default: {} });
const toDelete = ref<string>();
// let reloadAllMedia: Function;
const {
  data: mediaFilesData,
  refresh: reloadAllMedia,
  error: mediaFilesError,
} = await useFetch(
  () =>
    `/api/ant-media-module/media?search=${
      route.query.search || ''
    }&provider=${props.provider}`,
  {
    headers: {
      Authorization: jwt,
    },
  }
);

if (mediaFilesError.value) {
  throw createError({
    statusCode: mediaFilesError.value.statusCode,
    statusMessage: `Error while fetching data: ${mediaFilesError.value}`,
  });
}

const { data, error } = await useFetch(
  `/api/ant-media-module/media/${route.params.mediaId}?provider=${props.provider}`,
  {
    headers: {
      Authorization: jwt,
    },
  }
);

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode,
    statusMessage: `Error while fetching data: ${error.value}`,
  });
}

if (data.value?.notFound) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
}

media.value = data.value;
loading.value = false;

async function onSubmit() {
  saving.value = true;
  errors.value = [];

  // validator.value.validate(media.value.default);

  // if (validator.value.hasErrors()) {
  //   saving.value = false;
  //   return;
  // }

  const { data: response } = await useFetch(
    `/api/ant-media-module/media/${useRoute().params.mediaId}?provider=${props.provider}`,
    {
      // ...useDefaultFetchOpts(),
      ...{
        method: 'PUT',
        body: media.value.default,
      },
    }
  );
  saving.value = false;

  if (response.value.badRequest || response.value.notFound) {
    $toaster.toastError(
      (
        response.value?.badRequest.errors || response.value?.notFound.errors
      ).join('\n')
    );
  } else {
    $toaster.toastUpdated();
    reloadAllMedia();
  }
}

function onDeleteMedia(mediaId: string) {
  deleteDialogActive.value = true;
  toDelete.value = mediaId;
}

async function deleteMedia() {
  await useFetch(
    `/api/ant-media-module/media/${toDelete.value}?provider=${props.provider}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: jwt,
      },
    }
  );

  $toaster.toastDeleted();

  router.push(props.getListingRoute());
}
</script>

<template>
  <div>
    <AntDualContent>
      <template #mainHead>
        <AntTabs :tabs="tabs" />

        <DeleteButton
          data-cy="media-detail-delete"
          label="Delete"
          @click="() => onDeleteMedia(media.default.id)"
        />
      </template>

      <template #mainBody>
        <ul
          data-cy="response-errors"
          v-if="errors.length"
          style="
            background: #dc2626;
            color: #fff;
            padding: 20px;
            list-style-position: inside;
          "
        >
          <li v-for="error in errors">{{ error }}</li>
        </ul>

        <AntForm
          v-if="media.default"
          @submit.prevent="onSubmit"
          class="flex flex-col bg-white"
          id="update-media-form"
        >
          <img
            v-if="media.default.url"
            class="max-h-96 object-contain"
            :alt="media.default.title"
            :src="media.default.url"
          />

          <div data-cy="title">
            <AntInput
              v-model:value="media.default.title"
              label="Name"
            >
              <template #errorList="{ errors }">
                <div
                  data-cy="error"
                  v-for="message in errors"
                  class="text-red-600"
                >
                  {{ message }}
                </div>
              </template>
            </AntInput>
          </div>
        </AntForm>
      </template>

      <template #mainFooter>
        <AntButton>
          <NuxtLink :to="getListingRoute()"> Back</NuxtLink>
        </AntButton>

        <AntButton
          type="submit"
          data-cy="submit"
          :primary="true"
          form="update-media-form"
        >
          Save
        </AntButton>
      </template>

      <template #asideHead>
        <AntInput
          v-model:value="_search"
          placeholder="Search"
        />
      </template>

      <template #asideBody>
        <MediaTable
          :media-files="mediaFilesData.default"
          :get-detail-route="getDetailRoute"
          @reload-media="() => reloadAllMedia()"
        />
      </template>
    </AntDualContent>

    <AntModal
      v-model:active="deleteDialogActive"
      title="Delete file"
    >
      <div>Realy want to delete this file?</div>

      <template #buttons>
        <AntButton
          primary
          @click="deleteDialogActive = false"
        >
          Cancel
        </AntButton>

        <DeleteButton
          data-cy="media-detail-delete-dialog-button"
          label="Delete"
          @click="() => deleteMedia()"
        />
      </template>
    </AntModal>
  </div>
</template>
