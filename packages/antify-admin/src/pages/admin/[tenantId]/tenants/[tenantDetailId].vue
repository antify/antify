<script
  setup
  lang="ts"
>
import { Response as GetResponse } from '~~/glue/api/tenants/[tenantDetailId].get';
import {
  validator as baseValidator,
  Response as PutResponse,
} from '~~/glue/api/tenants/[tenantDetailId].put';
import TenantLink from '~~/components/fields/TenantLink.vue';
import TenantTable from '~~/components/entity/tenant/TenantTable.vue';
import { AntTabsType } from '@antify/antify-ui';

const { $toaster } = useNuxtApp();
const route = useRoute();

const errors = ref([]);
const loading = ref<Boolean>(false);
const validator = ref(baseValidator);
const search = ref('');
const deleteDialogActive = ref(false);
const tabs = ref<AntTabsType[]>([
  {
    name: 'Stammdaten',
    current: true,
    to: '',
  },
]);

const { data } = await useFetch<GetResponse | PutResponse>(
  `/api/tenants/${route.params.tenantDetailId}`,
  {
    ...useDefaultFetchOpts(),
    key: `/api/tenants/${route.params.tenantDetailId}`,
  }
);

async function onSubmit() {
  loading.value = true;
  errors.value = [];

  validator.value.validate(data.value.default, 1);

  if (validator.value.hasErrors()) {
    loading.value = false;
    return;
  }

  const { data: response } = await useFetch<PutResponse>(
    `/api/tenants/${useRoute().params.tenantDetailId}`,
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

  if (response.value.badRequest) {
    $toaster.toastError(response.value.badRequest.errors.join('\n'));
  }
}

async function deleteTenant() {
  await useFetch<PutResponse>(
    `/api/tenants/${useRoute().params.tenantDetailId}`,
    {
      ...useDefaultFetchOpts(),
      ...{
        method: 'DELETE',
      },
    }
  );

  deleteDialogActive.value = false;
  $toaster.toastDeleted();

  await navigateTo({
    name: 'admin-tenantId-tenants',
    params: {
      tenantId: route.params.tenantId,
    },
  });
}
</script>

<template>
  <div>
    <AntDualContent>
      <template #mainHead>
        <AntTabs :tabs="tabs" />

        <DeleteButton
          v-if="data.default.id !== route.params.tenantId"
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
          @submit.prevent="onSubmit"
          id="edit-tenant-form"
        >
          <div data-cy="name">
            <AntInput
              v-model:value="data.default.name"
              label="Bezeichnung"
              autofocus
              :validator="(val: string) => validator.validateProperty('name', val, 1)"
              :errors="validator.errorMap['name']"
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
              name: 'admin-tenantId-tenants',
              query: route.query,
            }"
          >
            Zurück
          </TenantLink>
        </AntButton>

        <AntButton
          :primary="true"
          type="submit"
          data-cy="submit"
          form="edit-tenant-form"
        >
          Speichern
        </AntButton>
      </template>

      <template #asideHead>
        <AntInput
          v-model:value="search"
          placeholder="Suche"
        />
      </template>

      <template #asideBody><TenantTable /></template>
    </AntDualContent>

    <AntModal
      v-model:active="deleteDialogActive"
      title="Mandant löschen"
    >
      <div>
        Sind sie sicher das Sie diesen Mandanten wirklich, sicherlich und
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
          @click="deleteTenant"
        />
      </template>
    </AntModal>
  </div>
</template>
