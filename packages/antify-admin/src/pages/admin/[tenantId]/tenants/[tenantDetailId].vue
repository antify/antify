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
const loading = ref<Boolean>(true);
const saving = ref<Boolean>(false);
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

const tenant = ref<GetResponse>({ default: {} });
let refresh: Function;

onMounted(async () => {
  const { data, refresh: tenantRefresh } = await useFetch<
    GetResponse | PutResponse
  >(`/api/tenants/${route.params.tenantDetailId}`, {
    ...useDefaultFetchOpts(),
    key: `/api/tenants/${route.params.tenantDetailId}`,
  });

  refresh = tenantRefresh;

  tenant.value = data.value as GetResponse;
  loading.value = false;
});

async function onSubmit() {
  saving.value = true;
  errors.value = [];

  validator.value.validate(tenant.value.default, 1);

  if (validator.value.hasErrors()) {
    saving.value = false;
    return;
  }

  const { data: response } = await useFetch<PutResponse>(
    `/api/tenants/${useRoute().params.tenantDetailId}`,
    {
      ...useDefaultFetchOpts(),
      ...{
        method: 'PUT',
        body: tenant.value.default,
      },
    }
  );

  saving.value = false;

  if (response.value.badRequest) {
    $toaster.toastError(response.value.badRequest.errors.join('\n'));
    return;
  }

  await refresh();
  $toaster.toastUpdated();
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
          v-if="tenant.default.id !== route.params.tenantId"
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
              v-model:value="tenant.default.name"
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
          :disabled="saving || loading"
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
