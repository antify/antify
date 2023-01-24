<script setup lang="ts">
import { faCamera, faX } from '@fortawesome/free-solid-svg-icons';
import { validator as baseValidator } from '~~/glue/api/backoffice/[tenantId]/tenant/index.put';
import { AntTabsType } from '@antify/antify-ui';

const { $toaster } = useNuxtApp();
const route = useRoute();

const errors = ref([]);
const loading = ref<Boolean>(true);
const saving = ref<Boolean>(false);
const validator = ref(baseValidator);
const deleteDialogActive = ref(false);
const uploadInProgress = ref<Boolean>(false);
const logoUpload = ref({});
const tabs = ref<AntTabsType[]>([
  {
    name: 'Main data',
    current: true,
    to: '',
  },
]);

const tenant = ref({
  default: {
    name: '',
  },
});

const { data, refresh } = await useFetch(
  `/api/tenants/${route.params.tenantId}`,
  {
    ...useDefaultFetchOpts(),
    key: `/api/tenants/${route.params.tenantId}`,
  }
);

tenant.value = data.value;
loading.value = false;

async function onSubmit() {
  saving.value = true;
  errors.value = [];

  validator.value.validate(tenant.value.default, 1);

  if (validator.value.hasErrors()) {
    saving.value = false;
    return;
  }

  const { data: response } = await useFetch(
    `/api/tenants/${useRoute().params.tenantId}`,
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

async function onSelectFile(event) {
  uploadInProgress.value = true;
  let formData = new FormData();

  for (let i = 0; i < event.target.files.length; i++) {
    formData.append(`file-${i}`, event.target.files[i]);
  }

  await useFetch(`/api/tenants/file/${tenant.value.default.id}/tenant_logo`, {
    ...useDefaultFetchOpts(),
    method: 'POST',
    body: formData,
  });

  // TODO:: Error handling is missing

  $toaster.toastCreated();
  uploadInProgress.value = false;
}

async function removeLogo() {
  const res = await useFetch(
    `/api/tenants/file/${tenant.value.default.id}/tenant_logo`,
    {
      ...useDefaultFetchOpts(),
      method: 'DELETE',
    }
  );

  if (res.error.value) {
    $toaster.toastError((res.error.value as Error).message);

    return;
  }

  tenant.value.default.url = '';

  $toaster.toastDeleted();
}

async function deleteTenant() {
  await useFetch(`/api/tenants/${useRoute().params.tenantId}`, {
    ...useDefaultFetchOpts(),
    ...{
      method: 'DELETE',
    },
  });

  deleteDialogActive.value = false;
  $toaster.toastDeleted();

  await navigateTo({
    name: 'backoffice-tenantId-tenants',
    params: {
      tenantId: route.params.tenantId,
    },
  });
}
</script>

<template>
  <div>
    <AntContent>
      <template #head>
        <AntTabs :tabs="tabs" />

        <DeleteButton
          v-if="tenant.default.id !== route.params.tenantId"
          label="Löschen"
          @click="deleteDialogActive = true"
        />
      </template>

      <template #body>
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
              :loading="loading"
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

          <div data-cy="logo">
            <div class="block text-sm font-medium text-gray-700">
              Mandanten Logo hochladen
            </div>

            <AntUpload
              v-model:value="logoUpload"
              accept-type="acceptType"
              :icon="faCamera"
              :show-preview="true"
              :loading="uploadInProgress"
              @change="onSelectFile"
            >
              <template #label>Logo hochladen</template>

              <template #preview="uploaded">
                <div
                  class="mr-4 flex items-center relative"
                  v-if="(uploaded && uploaded.src) || tenant.default.url"
                >
                  <AntProfilePicture
                    :image-url="uploaded.src || tenant.default.url"
                    :alt="uploaded.fileName"
                    size="large"
                    class="h-16"
                  />

                  <div
                    class="absolute w-4 h-4 -right-2 -top-1 z-10 cursor-pointer"
                    title="Profilbild entfernen"
                    @click="removeLogo()"
                  >
                    <fa-icon
                      :icon="faX"
                      class="h-full w-full text-gray-400 hover:text-gray-800 transition-all duration-300"
                    />
                  </div>
                </div>
              </template>
            </AntUpload>
          </div>
        </AntForm>
      </template>
    </AntContent>

    <AntModal
      v-model:active="deleteDialogActive"
      title="Mandant löschen"
    >
      <div>
        Sind sie sicher das Sie diesen Mandanten wirklich löschen wollen?
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
