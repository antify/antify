<script lang="ts" setup>
// TODO:: the template contains way to mutch UI thinks like stylings.
// This component should only implement the functionality of AntUpload in a reuseable way.
// TODO:: implement allowing specific types of files like images only.
import { ref } from 'vue';
import { faCamera, faX } from '@fortawesome/free-solid-svg-icons';

const props = defineProps<{
  provider: string;
  directory: string;
}>();
const emit = defineEmits(['afterUpload']);
const uploadInProgress = ref<Boolean>(false);
const profilePicture = ref({});

const { $documentStorageClient } = useNuxtApp();

async function onSelectFile(event) {
  uploadInProgress.value = true;

  const data = await $documentStorageClient().upload(
    props.provider,
    props.directory,
    event
  );

  // TODO:: Error handling is missing

  //   $toaster.toastCreated();
  uploadInProgress.value = false;

  emit('afterUpload', data);
}

// TODO:: implement remove action
async function removeProfilePicture() {
  //   await useFetch('/api/profile/profile_picture', {
  //     ...useDefaultFetchOpts(),
  //     method: 'DELETE',
  //   });
  //   $toaster.toastDeleted();
}
</script>

<template>
  <AntUpload
    v-model:value="profilePicture"
    accept-type="acceptType"
    :icon="faCamera"
    :show-preview="true"
    :loading="uploadInProgress"
    @change="onSelectFile"
  >
    <template #label>Upload file</template>

    <template #preview="uploaded">
      <div
        class="mr-4 flex items-center relative"
        v-if="uploaded && uploaded.src"
      >
        <AntProfilePicture
          :image-url="uploaded.src"
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
</template>
