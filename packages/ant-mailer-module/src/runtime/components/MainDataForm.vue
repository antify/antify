<script setup lang="ts">
import { validator as baseValidator } from '../glue/main-data-form/[mailTemplateId].put';
import SendTestMail from './SendTestMail.vue';
import { LocationAsRelativeRaw } from 'vue-router';
import { useContextHeader, useTenantHeader } from '@antify/context';

// TODO:: on loading, the rich text editor get hidden. Implement loading state in antify ui's richtext editor and fix it here
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
const loading = ref(true);
const saving = ref(false);

const { data, refresh, error } = await useFetch(
  `/api/ant-mailer-module/main-data-form/${currentMailTemplateId}`,
  {
    headers: {
      // TODO:: remove with nuxt 3.2.0
      ...useRequestHeaders(),
      ...useContextHeader(props.context),
      ...useTenantHeader(props.tenantId),
    },
  }
);

if (error.value) {
  throw createError({ ...error.value.data, statusCode: 500, fatal: true });
}

loading.value = false;

async function onSubmit() {
  validator.value.validate(data.value.default, 1);

  if (validator.value.hasErrors()) {
    return;
  }

  saving.value = true;

  // TODO:: Fix following case: Change mailTemplate > press save > change it again. Now for each change one request get triggered.
  const { data: response, error } = await useFetch(
    `/api/ant-mailer-module/main-data-form/${useRoute().params.mailTemplateId}`,
    {
      method: 'PUT',
      body: data.value.default,
      headers: {
        ...useContextHeader(props.context),
        ...useTenantHeader(props.tenantId),
      },
    }
  );

  if (error.value) {
    throw createError({ ...error.value.data, statusCode: 500, fatal: true });
  }

  data.value = response.value;

  $toaster.toastUpdated();
  saving.value = false;

  if (response.value.errorType === 'BAD_REQUEST') {
    $toaster.toastError(response.value.errors.join('\n'));
  }
}

hook('page:start', () => {
  loading.value = true;
});
</script>

<template>
  <div v-if="data.default">
    <AntForm
      @submit.prevent="onSubmit"
      class="space-y-0"
      id="mail-template-form"
    >
      <div class="transition-opacity space-y-4 mt-0">
        <div data-cy="title">
          <AntInput
            v-model:value="data.default.title"
            label="Title"
            :errors="validator.errorMap['title']"
            :validator="
              () => validator.validateProperty('title', data.default.title, 1)
            "
            :loading="loading"
            :disabled="saving"
          >
            <template #errorList="{ errors }">
              <div
                data-cy="error"
                class="text-red-600"
                v-for="message in errors"
              >
                {{ message }}
              </div>
            </template>
          </AntInput>
        </div>

        <div
          data-cy="content"
          v-if="!loading"
        >
          <AntRichTextEditor
            v-model:data="data.default.content"
            label="Content"
            :errors="validator.errorMap['content']"
            :validator="(val: string) => validator.validateProperty('content', val, 1)"
            :loading="loading"
            :disabled="saving"
          >
            <template #errorList="{ errors }">
              <div
                data-cy="error"
                v-for="message in errors"
              >
                {{ message }}
              </div>
            </template>
          </AntRichTextEditor>
        </div>
      </div>

      <ClientOnly>
        <Teleport :to="saveButtonTeleportTarget">
          <AntButton
            :primary="true"
            type="submit"
            data-cy="submit"
            form="mail-template-form"
          >
            Save
          </AntButton>
        </Teleport>
      </ClientOnly>
    </AntForm>

    <SendTestMail
      :context="context"
      :tenant-id="tenantId"
      :mail-template-id="currentMailTemplateId"
    />
  </div>

  <!-- TODO:: Replace with antify ui no entry component: https://github.com/antify/antify-ui/issues/50 -->
  <div
    class="text-center"
    v-else
  >
    This entry does not exists. May an other user deleted it.
  </div>
</template>
