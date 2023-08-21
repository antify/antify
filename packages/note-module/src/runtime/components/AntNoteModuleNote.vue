<script setup lang='ts'>
import AntNoteModuleDeleteModal from './AntNoteModuleDeleteModal.vue';
import { useContextHeader, useTenantHeader } from '@antify/context';
import { AntSkeleton, AntTextarea } from '@antify/antify-ui';
import { validator as updateValidator } from '../glue/note/[noteId].put';

const { $toaster } = useNuxtApp();
const props = defineProps<{
  noteId: string;
  content: string;
  provider: string;
  tenantId?: string;
}>();
const emit = defineEmits(['noteDeleted', 'update:content']);
const modalVisible = ref(false);
const showMenu = ref(false);
const isUpdateContext = ref(false);
const _content = ref(props.content);
const validator = ref(updateValidator);

const { error, execute, status } = useFetch(
  `/api/note-module/notes/${props.noteId}`,
  {
    method: 'DELETE',
    headers: {
      ...useContextHeader(props.provider),
      ...useTenantHeader(props.tenantId)
    },
    immediate: false
  }
);
const updateRequestData = {
  content: _content
};
const {
  data: updateData,
  error: updateError,
  execute: executeUpdate,
  status: updateStatus
} = useFetch(
  `/api/note-module/notes/${props.noteId}`,
  {
    method: 'PUT',
    body: updateRequestData,
    headers: {
      ...useContextHeader(props.provider),
      ...useTenantHeader(props.tenantId)
    },
    immediate: false,
    watch: false
  }
);

async function deleteNote() {
  await execute();

  if (error.value) {
    throw createError({
      ...error.value,
      fatal: true
    });
  } else {
    $toaster.toastDeleted();
    modalVisible.value = false;
    emit('noteDeleted');
  }
}

async function updateNote() {
  validator.value.validate(updateRequestData);

  if (validator.value.hasErrors()) {
    return;
  }

  await executeUpdate();

  if (updateError.value) {
    throw createError({
      ...error.value,
      fatal: true
    });
  } else {
    if (updateData.value.notFound) {
      return $toaster.toastError('Note not found');
    }

    $toaster.toastUpdated();
    isUpdateContext.value = false;
    emit('update:content', updateData.value.default.content);
    _content.value = updateData.value.default.content;
  }
}

function onFocusOut() {
  setTimeout(() => showMenu.value = false, 100);
}
</script>

<template>
  <div
    class='bg-yellow-200 border-yellow-400 border rounded p-2 flex justify-between'
  >
    <div
      class='cursor-pointer whitespace-pre-wrap'
      v-if='!isUpdateContext'
      @click='() => isUpdateContext = true'>
      {{ content }}
    </div>

    <AntTextarea
      v-else
      v-model:value='_content'
      :disabled='updateStatus === "pending"'
      placeholder='Note'
      :validator="(val: string) => validator.validateProperty('content', val, 1)"
      :errors="validator.errorMap['content']"
      @focusout='updateNote'
    />

    <div class='relative'>
      <div
        class='cursor-pointer p-1'
        @click='() => showMenu = true'
        @focusout='onFocusOut'
        tabindex='0'
      >
        <svg xmlns='http://www.w3.org/2000/svg' height='1em' viewBox='0 0 128 512'>
          <path
            d='M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z' />
        </svg>
      </div>

      <div v-if='showMenu' class='absolute right-0 bg-white shadow'>
        <div @click='() => modalVisible = true' class='cursor-pointer p-2'>Delete</div>
      </div>
    </div>

    <AntNoteModuleDeleteModal
      v-model:visible='modalVisible'
      :loading='status === "pending"'
      @submit='deleteNote'
    >
      Are you sure you want to delete this note? <br>This action cannot be undone
    </AntNoteModuleDeleteModal>
  </div>
</template>
