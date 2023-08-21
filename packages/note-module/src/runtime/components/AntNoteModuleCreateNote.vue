<script setup lang='ts'>
import { useContextHeader, useTenantHeader } from '@antify/context';
import { validator as createValidator } from '../glue/note/index.post';

const { $toaster } = useNuxtApp();
const props = defineProps<{
  isGlobalVisible: boolean;
  provider: string;
  tenantId?: string;
}>();
const validator = ref(createValidator);
const emit = defineEmits(['created']);
const content = ref('');

const requestData = {
  content: content,
  isGlobalVisible: props.isGlobalVisible
};
const { error, data, execute, status } = useFetch(
  `/api/note-module/notes`,
  {
    method: 'POST',
    body: requestData,
    headers: {
      ...useContextHeader(props.provider),
      ...useTenantHeader(props.tenantId)
    },
    immediate: false,
    watch: false
  }
);

async function save() {
  validator.value.validate(requestData);

  if (validator.value.hasErrors()) {
    return;
  }

  await execute();

  if (error.value) {
    throw createError({
      ...error.value,
      fatal: true
    });
  }

  $toaster.toastCreated();
  emit('created', data.value);
  content.value = '';
}
</script>

<template>
  <div class='bg-yellow-200 border-yellow-400 border rounded p-2 flex justify-between'>
    <AntTextarea
      v-model:value='content'
      :disabled='status === "pending"'
      :validator="(val: string) => validator.validateProperty('content', val, 1)"
      :errors="validator.errorMap['content']"
      @focusout='save'
    />
  </div>
</template>
