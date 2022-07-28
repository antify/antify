<script
  setup
  lang="ts"
>
import { Response as GetResponse } from '~~/glue/api/admin/[tenantId]/media/[mediaId].get';
import { Response } from '~~/glue/api/admin/[tenantId]/media/index.get';
import {
  validator as baseValidator,
  Response as PutResponse,
} from '~~/glue/api/admin/[tenantId]/media/[mediaId].put';
import TenantLink from '~~/components/fields/TenantLink.vue';
import MediaTable from '~~/components/entity/media/MediaTable.vue';

const route = useRoute();
const router = useRouter();

const { data } = await useFetch<GetResponse | PutResponse>(
  `/api/admin/:tenantId/media/${useRoute().params.mediaId}`,
  useDefaultFetchOpts()
);

const { data: mediaFiles, refresh: reloadAllMedia } = await useFetch<Response>(
  () => `/api/admin/:tenantId/media?search=${route.query.search || ''}`,
  useDefaultFetchOpts()
);

const search = ref(route.query?.search || '');
const { $toaster } = useNuxtApp();
const errors = ref([]);
const loading = ref<Boolean>(false);
const validator = ref(baseValidator);
const deleteDialogActive = ref(false);

const _search = computed({
  get() {
    return search.value;
  },
  set(val) {
    router.push({
      name: 'admin-tenantId-media',
      query: {
        ...route.query,
        search: val,
      },
    });
  },
});

async function onSubmit() {
  loading.value = true;
  errors.value = [];

  validator.value.validate(data.value.default);

  if (validator.value.hasErrors()) {
    loading.value = false;
    return;
  }

  const { data: response } = await useFetch<PutResponse>(
    `/api/admin/:tenantId/media/${useRoute().params.mediaId}`,
    {
      ...useDefaultFetchOpts(),
      ...{
        method: 'PUT',
        body: data.value.default,
      },
    }
  );
  loading.value = false;

  if (response.value.default) {
    data.value = response.value;
    $toaster.toastUpdated();
  }
  reloadAllMedia();

  if (response.value.badRequest || response.value.notFound) {
    $toaster.toastError(
      (
        response.value?.badRequest.errors || response.value?.notFound.errors
      ).join('\n')
    );
  } else {
    // TODO:: toast success
  }
}

async function onDeleteMedia(mediaId: string) {
  // TODO:: "you sure?" Dialog

  await useFetch(`/api/admin/:tenantId/media/${mediaId}`, {
    ...useDefaultFetchOpts(),
    method: 'DELETE',
  });

  $toaster.toastCreated();

  reloadAllMedia();

  router.push({ name: 'admin-tenantId-media', query: route.query });
}
</script>

<template>
  <div>
    <AntDualContent>
      <template #mainHead>
        <AntHeader header-type="h1">Datei bearbeiten</AntHeader>

        <DeleteButton
          label="Löschen"
          @click="deleteDialogActive = true"
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
          v-if="data.default"
          @submit.prevent="onSubmit"
          class="flex flex-col bg-white"
          id="update-media-form"
        >
          <img
            v-if="data.default.url"
            class="max-h-96 object-contain"
            :alt="data.default.title"
            :src="data.default.url"
          />

          <div data-cy="title">
            <AntInput
              v-model:value="data.default.title"
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
              name: 'admin-tenantId-media',
              query: route.query,
            }"
          >
            Zurück
          </TenantLink>
        </AntButton>

        <AntButton
          type="submit"
          data-cy="submit"
          :primary="true"
          form="update-media-form"
        >
          Speichern
        </AntButton>
      </template>

      <template #asideHead>
        <AntInput
          v-model:value="_search"
          placeholder="Suche"
        />
      </template>

      <template #asideBody>
        <MediaTable
          :media-files="mediaFiles.default"
          @reload-media="reloadAllMedia"
        />
      </template>
    </AntDualContent>

    <AntModal
      v-model:active="deleteDialogActive"
      title="Datei löschen"
    >
      <div>
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
          label="Löschen"
          @click="() => onDeleteMedia(data.default.id)"
        />
      </template>
    </AntModal>
  </div>
</template>
