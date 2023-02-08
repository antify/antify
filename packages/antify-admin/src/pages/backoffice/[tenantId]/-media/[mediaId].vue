<script setup lang="ts">
import { Response as GetResponse } from '~~/glue/api/backoffice/[tenantId]/media/[mediaId].get';
import { Response } from '~~/glue/api/backoffice/[tenantId]/media/index.get';
import {
  validator as baseValidator,
  Response as PutResponse,
} from '~~/glue/api/backoffice/[tenantId]/media/[mediaId].put';
import TenantLink from '~~/components/fields/TenantLink.vue';
import MediaTable from '~~/components/entity/media/MediaTable.vue';
import { AntTabsType } from '@antify/antify-ui';

const route = useRoute();
const router = useRouter();

const search = ref(route.query?.search || '');
const { $toaster } = useNuxtApp();
const errors = ref([]);
const loading = ref<Boolean>(true);
const saving = ref<Boolean>(false);
const validator = ref(baseValidator);
const deleteDialogActive = ref(false);
const tabs = ref<AntTabsType[]>([
  {
    name: 'Main data',
    current: true,
    to: '',
  },
]);

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

const mediaFiles = ref<Response>({ default: [] });
const media = ref<GetResponse>({ default: {} });
const toDelete = ref<string>();
let reloadAllMedia: Function;

onMounted(async () => {
  const { data: mediaFilesData, refresh } = await useFetch<Response>(
    () => `/api/backoffice/:tenantId/media?search=${route.query.search || ''}`,
    useDefaultFetchOpts()
  );
  reloadAllMedia = refresh;
  mediaFiles.value = mediaFilesData.value;

  const { data } = await useFetch<GetResponse | PutResponse>(
    `/api/backoffice/:tenantId/media/${route.params.mediaId}`,
    useDefaultFetchOpts()
  );

  if (data.value.notFound) {
    //TODO:: Go to 404 page
    return;
  }

  media.value = data.value as GetResponse;
  loading.value = false;
});

async function onSubmit() {
  saving.value = true;
  errors.value = [];

  validator.value.validate(media.value.default);

  if (validator.value.hasErrors()) {
    saving.value = false;
    return;
  }

  const { data: response } = await useFetch<PutResponse>(
    `/api/backoffice/:tenantId/media/${useRoute().params.mediaId}`,
    {
      ...useDefaultFetchOpts(),
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
  await useFetch(`/api/backoffice/:tenantId/media/${toDelete.value}`, {
    ...useDefaultFetchOpts(),
    method: 'DELETE',
  });

  $toaster.toastCreated();

  reloadAllMedia();

  router.push({ name: 'backoffice-tenantId-media', query: route.query });
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
              :errors="validator.errorMap['title']"
              :validator="(val: string) => validator.validateProperty('title', val, 1)"
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
          <TenantLink
            :to="{
              name: 'backoffice-tenantId-media',
              query: route.query,
            }"
          >
            Back
          </TenantLink>
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
          :media-files="mediaFiles.default"
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
          Abbrechen
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
