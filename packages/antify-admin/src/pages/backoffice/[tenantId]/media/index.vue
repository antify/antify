<script setup lang="ts">
import { Response } from '~~/glue/api/backoffice/[tenantId]/media/index.get';
import Media from '~~/components/entity/media/Media.vue';

const file = ref({});
const loading = ref(true);
const { $toaster } = useNuxtApp();
const route = useRoute();
const dropzone = ref(null);
const counter = ref(0);
const uploading = ref(false);

const { data, refresh: reloadAllMedia } = await useFetch<Response>(
  () => `/api/backoffice/:tenantId/media?search=${route.query.search || ''}`,
  useDefaultFetchOpts()
);

loading.value = false;

const onSelectFile = async (files: File[]) => {
  uploading.value = true;

  let formData = new FormData();

  if (!Array.isArray(files)) {
    formData.append(`file`, files[0]);
  } else {
    for (let i = 0; i < 5; i++) {
      if (files.length > 0) {
        formData.append(`file-${i}`, files[0]);
        files.splice(0, 1);
      }
    }
  }

  await useFetch('/api/backoffice/:tenantId/media', {
    ...useDefaultFetchOpts(),
    method: 'POST',
    body: formData,
  });

  await reloadAllMedia();

  if (Array.isArray(files) && files.length > 0) {
    return await onSelectFile(files);
  }

  $toaster.toastCreated();

  uploading.value = false;
};

function onDrop(files: File[]) {
  onSelectFile(files);

  counter.value = 0;

  dropzone.value.$el.classList.add('hidden');
}

function dragOverHandler(event: DragEvent) {
  event.preventDefault();

  dropzone.value.$el.classList.remove('hidden');
}

function dragEnterHandler(event: DragEvent) {
  event.preventDefault();

  counter.value++;

  dropzone.value.$el.classList.remove('hidden');
}

function dragLeaveHandler(event: DragEvent) {
  event.preventDefault();

  counter.value--;

  if (counter.value === 0) {
    dropzone.value.$el.classList.add('hidden');
  }
}

onMounted(() => {
  document.body.addEventListener('dragover', dragOverHandler);
  document.body.addEventListener('dragenter', dragEnterHandler);
  document.body.addEventListener('dragleave', dragLeaveHandler);
});

onUnmounted(() => {
  document.body.removeEventListener('dragover', dragOverHandler);
  document.body.removeEventListener('dragenter', dragEnterHandler);
  document.body.removeEventListener('dragleave', dragLeaveHandler);
});
</script>

<template>
  <div>
    <AntContent>
      <template #head>
        <AntHeader>Mediatheke</AntHeader>

        <AntUpload
          v-model:value="file"
          @upload="onSelectFile"
          accept-type="image/*,application/pdf,text/plain"
          :loading="uploading"
          label-style="cursor-pointer flex space-x-4 items-center text-gray-400"
          data-cy="media-upload-input"
        >
          <template #preview><span></span></template>

          <template #label>
            <div data-cy="media-upload-button">
              <CreateButton
                label="Hochladen"
                class="pointer-events-none"
              />
            </div>
          </template>
        </AntUpload>
      </template>

      <template #body>
        <AntDropzone
          id="media-dropzone"
          data-cy="media-dropzone"
          ref="dropzone"
          class="hidden absolute h-screen w-screen inset-0 bg-primary bg-opacity-75 z-50 p-4"
          @dropped="onDrop"
        >
          <div
            class="flex justify-center items-center text-5xl text-white h-full border-4 border-dashed rounded-lg"
          >
            Datei hochladen
          </div>
        </AntDropzone>

        <div
          v-if="uploading"
          class="absolute h-screen w-screen inset-0 bg-black bg-opacity-75 z-50 p-4"
        >
          <div
            class="flex justify-center items-center text-5xl text-white h-full border-4 border-dashed rounded-lg"
          >
            Bitte warten Sie bis die Datei(en) Hochgeladen wurden.
          </div>
        </div>

        <Media
          :media-files="data.default"
          @reload-media="reloadAllMedia"
        />
      </template>
    </AntContent>

    <Loader :loading="loading" />
  </div>
</template>
