<script setup lang='ts'>
import { validator as baseValidator } from '../glue/main-data-form/[mailTemplateId].put';
import SendTestMail from './SendTestMail.vue';
import { LocationAsRelativeRaw } from 'vue-router';
import { useContextHeader, useTenantHeader } from '@antify/context';

// TODO:: on loading, the rich text editor get hidden. Implement loading status in antify ui's richtext editor and fix it here
const props = defineProps<{
  context: string;
  tenantId?: string;
  getListingRoute: () => LocationAsRelativeRaw;
  getDetailRoute: (mailTemplateId: string) => LocationAsRelativeRaw;
  saveButtonTeleportTarget?: string;
}>();

const { $toaster, hook } = useNuxtApp();
const currentMailTemplateId = useRoute().params.mailTemplateId;
const validator = ref(baseValidator);
const saving = ref(false);

const { data, refresh, error, status, execute } = useFetch(
  `/api/mailer-module/main-data-form/${currentMailTemplateId}`,
  {
    headers: {
      ...useContextHeader(props.context),
      ...useTenantHeader(props.tenantId)
    },
    immediate: false,
    watch: false,
    default: () => ({
      title: '',
      content: ''
    })
  }
);
const {
  data: updateData,
  error: updateError,
  execute: executeUpdate,
  status: updateStatus
} = await useFetch(
  `/api/mailer-module/main-data-form/${useRoute().params.mailTemplateId}`,
  {
    method: 'PUT',
    body: data,
    headers: {
      ...useContextHeader(props.context),
      ...useTenantHeader(props.tenantId)
    },
    immediate: false,
    watch: false
  }
);

async function onSubmit() {
  validator.value.validate(data.value, 1);

  if (validator.value.hasErrors()) {
    return;
  }

  await executeUpdate();

  if (updateError.value) {
    throw createError({
      ...updateError.value,
      fatal: true
    });
  }

  data.value = updateData.value;

  $toaster.toastUpdated();
}

const _content = computed({
  get() {
    return data.value?.content || ''
  },
  set(val) {
    data.content = val;
  }
})

onMounted(execute);
</script>

<template>
  <!-- TODO:: Replace with antify ui no entry component: https://github.com/antify/antify-ui/issues/50 -->
  <div
    class='text-center'
    v-if='data?.notFound'
  >
    This entry does not exists. May an other user deleted it.
  </div>

  <div v-else>
    <AntForm
      @submit.prevent='onSubmit'
      class='space-y-0'
      id='mail-template-form'
    >
      <div class='transition-opacity space-y-4 mt-0'>
        <div data-cy='title'>
          <AntInput
            v-model:value='data.title'
            label='Title'
            :errors="validator.errorMap['title']"
            :validator="
              () => validator.validateProperty('title', data.title, 1)
            "
            :loading='status === "PENDING"'
            :disabled='updateStatus === "PENDING"'
          >
            <template #errorList='{ errors }'>
              <div
                data-cy='error'
                class='text-red-600'
                v-for='message in errors'
              >
                {{ message }}
              </div>
            </template>
          </AntInput>
        </div>

        <div
          v-if='status !== "PENDING"'
          data-cy='content'>

          <AntRichTextEditor
            v-model:data='_content'
            label='Content'
            :errors="validator.errorMap['content']"
            :validator="(val: string) => validator.validateProperty('content', val, 1)"
            :loading='status === "PENDING"'
            :disabled='updateStatus === "PENDING"'
          >
            <template #errorList='{ errors }'>
              <div
                data-cy='error'
                v-for='message in errors'
              >
                {{ message }}
              </div>
            </template>
          </AntRichTextEditor>
        </div>
      </div>

      <ClientOnly>
        <Teleport :to='saveButtonTeleportTarget'>
          <AntButton
            :primary='true'
            type='submit'
            data-cy='submit'
            form='mail-template-form'
            :disabled='updateStatus === "PENDING"'
          >
            Save
          </AntButton>
        </Teleport>
      </ClientOnly>
    </AntForm>

    <SendTestMail
      :context='context'
      :tenant-id='tenantId'
      :mail-template-id='currentMailTemplateId'
    />
  </div>
</template>
