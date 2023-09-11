<script setup lang='ts'>
import { useContextHeader, useTenantHeader } from '@antify/context';
import AntNoteModuleNote from './AntNoteModuleNote.vue';
import AntNoteModuleCreateNote from './AntNoteModuleCreateNote.vue';
import AntNoteModulePendingNote from './AntNoteModulePendingNote.vue';

const props = defineProps<{
  provider: string;
  tenantId?: string;
  isGlobalVisible: boolean;
}>();
const showCreateNote = ref(false);
const url = `/api/note-module/notes?isGlobalVisible=${props.isGlobalVisible}`;
const { data, execute, refresh, status, error } = useFetch(
  url,
  {
    key: url + props.provider + props.tenantId,
    headers: {
      ...useContextHeader(props.provider),
      ...useTenantHeader(props.tenantId)
    },
    immediate: false
  }
);
onMounted(() => execute());

function onCreated(note) {
  data.value.default?.push(note);
  showCreateNote.value = false;
}
</script>

<template>
  <div class='flex flex-col space-y-2 p-2'>
    <div class='flex flex-col space-y-2'>
      <div
        v-if='status !== "success"'
        class='flex flex-col space-y-2'
      >
        <AntNoteModulePendingNote />
        <AntNoteModulePendingNote />
        <AntNoteModulePendingNote />
      </div>

      <AntNoteModuleNote
        v-else
        v-for='note in data?.default'
        :note-id='note.id'
        v-model:content='note.content'
        :provider='provider'
        :tenant-id='tenantId'
        @noteDeleted='refresh'
      />

      <AntNoteModuleCreateNote
        v-if='showCreateNote'
        :is-global-visible='isGlobalVisible'
        :provider='provider'
        :tenant-id='tenantId'
        @created='onCreated'
      />
    </div>
    <div class='flex justify-center'>
      <AntButton @click='() => showCreateNote = true' primary>+</AntButton>
    </div>
  </div>
</template>
