<script lang="ts" setup>
import MediaTable from './MediaTable.vue';
import { LocationAsRelativeRaw } from 'vue-router';

const props = defineProps<{
  uploadDir: string;
  provider: string;
  getDetailRoute: (mediaId: string) => LocationAsRelativeRaw;
}>();
const file = ref({});
const loading = ref(true);
const { $toaster } = useNuxtApp();
const route = useRoute();
const dropzone = ref(null);
const counter = ref(0);
const uploading = ref(false);
const { $documentStorageClient } = useNuxtApp();

const {
  data,
  error,
  refresh: reloadAllMedia,
} = await useFetch(
  () =>
    `/api/ant-media-module/media?search=${route.query.search || ''}&provider=${
      props.provider
    }`,
  { headers: useRequestHeaders() }
);

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode,
    statusMessage: `Error while fetching data: ${error.value}`,
  });
}

loading.value = false;

const onSelectFile = async (event) => {
  uploading.value = true;

  const files = await $documentStorageClient.upload(
    props.provider,
    props.uploadDir,
    event
  );

  await useFetch(`/api/ant-media-module/media?provider=${props.provider}`, {
    method: 'POST',
    body: files,
  });

  // TODO:: update media table

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
          accept-type="image/*,application/pdf,text/plain"
          :loading="uploading"
          label-style="cursor-pointer flex space-x-4 items-center text-gray-400"
          data-cy="media-upload-input"
          @change="onSelectFile"
        >
          <template #preview><span></span></template>

          <template #label>
            <div data-cy="media-upload-button">
              <CreateButton
                label="Upload"
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

        <MediaTable
          :media-files="data.default"
          @reload-media="reloadAllMedia"
          :get-detail-route="getDetailRoute"
        />
      </template>
    </AntContent>

    <Loader :loading="loading" />
  </div>
</template>
