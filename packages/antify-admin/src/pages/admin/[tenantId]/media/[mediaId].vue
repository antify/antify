<script setup lang="ts">
import { ROW_TYPES } from '@antify/antify-ui';
import { Response as GetResponse } from '~~/glue/api/admin/[tenantId]/media/[mediaId].get';
import { Response as GetCollectionResponse} from "~~/glue/api/admin/[tenantId]/media/index.get";
import {
  validator as baseValidator,
  Response as PutResponse,
} from '~~/glue/api/admin/[tenantId]/media/[mediaId].put';
import TenantLink from '~~/components/fields/TenantLink.vue';

const { data } = await useFetch<GetResponse | PutResponse>(
  `/api/admin/:tenantId/media/${useRoute().params.mediaId}`,
  useDefaultFetchOpts()
);

const search = ref('');
const { $toaster } = useNuxtApp();
const errors = ref([]);
const loading = ref<Boolean>(false);
const validator = ref(baseValidator);
const onSubmit = async () => {
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
    reloadAllMedia();
  }

  if (response.value.badRequest || response.value.notFound) {
    $toaster.toastError((response.value?.badRequest.errors || response.value?.notFound.errors).join('\n'));
  }
};

const { data: mediaList, refresh: reloadAllMedia } = await useFetch<GetCollectionResponse>(
  "/api/admin/:tenantId/media",
  useDefaultFetchOpts()
);
const tableHeaders = [
  {
    title: "Name",
    identifier: "title",
    type: ROW_TYPES.SLOT,
  },
];
</script>

<template>
  <AntDualContent>
    <template #mainHead>
      <AntHeader header-type="h1">Datei bearbeiten</AntHeader>
    </template>

    <template #mainBody>
      <ul data-cy="response-errors" v-if="errors.length" style="
          background: #dc2626;
          color: #fff;
          padding: 20px;
          list-style-position: inside;
        ">
        <li v-for="error in errors">{{ error }}</li>
      </ul>

      <AntForm @submit.prevent="onSubmit" class="flex flex-col bg-white" id="update-media-form">
        <div data-cy="title">
          <AntInput v-model:value="data.default.title" label="Name" :errors="validator.errorMap['title']"
            :validator="(val: string) => validator.validateProperty('title', val, 1)">
            <template #errorList="{ errors }">
              <div data-cy="error" v-for="message in errors" class="text-red-600">
                {{ message }}
              </div>
            </template>
          </AntInput>
        </div>
      </AntForm>
    </template>

    <template #mainFooter>
      <AntButton>
        <TenantLink :to="{
          name: 'admin-tenantId-media',
        }">
          Zurück
        </TenantLink>
      </AntButton>

      <AntButton type="submit" data-cy="submit" :primary="true" form="update-media-form">
        Speichern
      </AntButton>
    </template>

    <template #asideHead>
      <AntInput v-model:value="search" placeholder="Suche" />
    </template>

    <template #asideBody>
      <AntTable :headers="tableHeaders" :data="(mediaList.default || [])">
        <template #cellContent="{ elem }">
          <TenantLink :to="{
            name: 'admin-tenantId-media-mediaId',
            params: { mediaId: elem.id },
          }">
            {{ elem.title }}
          </TenantLink>
        </template>
      </AntTable>
    </template>
  </AntDualContent>
</template>
