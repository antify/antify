<script setup lang="ts">
// TODO:: that's a copy - fix it
import { Response as GetResponse } from '~~/glue/api/profile/user.get';
import { faCamera, faX } from '@fortawesome/free-solid-svg-icons';
import {
  validator as baseValidator,
  Response as PutResponse,
} from '~~/glue/api/profile/user.put';

const { data } = await useFetch<GetResponse | PutResponse>(
  `/api/profile/user`,
  useDefaultFetchOpts()
);

const { $toaster } = useNuxtApp();
const errors = ref([]);
const loading = ref<Boolean>(false);
const uploadInProgress = ref<Boolean>(false);
const validator = ref(baseValidator);
const profilePicture = ref({});

async function onSubmit() {
  loading.value = true;
  errors.value = [];

  validator.value.validate(data.value.default, 1);

  if (validator.value.hasErrors()) {
    loading.value = false;
    return;
  }

  const { data: response } = await useFetch<PutResponse>(`/api/profile/user`, {
    ...useDefaultFetchOpts(),
    ...{
      method: 'PUT',
      body: data.value.default,
    },
  });
  loading.value = false;

  if (response.value.default) {
    data.value = response.value;
    $toaster.toastUpdated();
  }

  if (response.value.badRequest) {
    $toaster.toastError(response.value.badRequest.errors.join('\n'));
  }
}

async function onSelectFile(event) {
  uploadInProgress.value = true;
  let formData = new FormData();

  for (let i = 0; i < event.target.files.length; i++) {
    formData.append(`file-${i}`, event.target.files[i]);
  }

  await useFetch('/api/profile/profile_picture', {
    ...useDefaultFetchOpts(),
    method: 'POST',
    body: formData,
  });

  // TODO:: Error handling is missing

  $toaster.toastCreated();
  uploadInProgress.value = false;
}

async function removeProfilePicture() {
  await useFetch('/api/profile/profile_picture', {
    ...useDefaultFetchOpts(),
    method: 'DELETE',
  });

  $toaster.toastDeleted();
}
</script>

<template>
  <AntContent>
    <template #head>
      <AntHeader>Profil</AntHeader>
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

      <form
        class="px-4 py-4 space-y-4"
        @submit.prevent="onSubmit"
      >
        <div data-cy="name">
          <AntInput
            v-model:value="data.default.name"
            autofocus
            :label="'Name'"
            :errors="validator.errorMap['name']"
            :validator="
              (val: string) => validator.validateProperty('name', val, 1)
            "
          />
        </div>

        <div data-cy="email">
          <AntInput
            v-model:value="data.default.email"
            autofocus
            :label="'E-Mail'"
            :errors="validator.errorMap['email']"
            :is-error="
              validator.errorMap['email'] &&
              validator.errorMap['email'].length > 0
            "
            :validator="
              (val: string) => validator.validateProperty('email', val, 1)
            "
          />
        </div>

        <div>
          <div class="block text-sm font-medium text-gray-700">
            Profil Bild ändern
          </div>

          <AntUpload
            v-model:value="profilePicture"
            accept-type="acceptType"
            :icon="faCamera"
            :show-preview="true"
            :loading="uploadInProgress"
            @change="onSelectFile"
          >
            <template #label>Profil Bild hochladen</template>

            <template #preview="uploaded">
              <div
                class="mr-4 flex items-center relative"
                v-if="(uploaded && uploaded.src) || data.default.url"
              >
                <AntProfilePicture
                  :image-url="uploaded.src || data.default.url"
                  :alt="uploaded.fileName"
                  size="large"
                  class="h-16"
                />

                <div
                  class="absolute w-4 h-4 -right-2 -top-1 z-10 cursor-pointer"
                  title="Profilbild entfernen"
                  @click="removeProfilePicture()"
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

        <div>TODO:: Profile password</div>

        <AntButton
          type="submit"
          data-cy="submit"
          :primary="true"
        >
          Speichern
        </AntButton>
      </form>
    </template>
  </AntContent>
</template>
