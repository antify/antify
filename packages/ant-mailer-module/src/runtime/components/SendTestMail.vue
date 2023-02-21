<script setup lang="ts">
import { validator as sendTestMailValidator } from '../glue/send-test-mail/[mailTemplateId].post';
import { useContextHeader } from '@antify/context';

const props = defineProps<{
  mailTemplateId: string;
  context: string;
}>();

const { $toaster } = useNuxtApp();

const loading = ref(false);
const testMail = ref('');
const sendingTestMail = ref(false);
const validator = ref(sendTestMailValidator);

async function onSendTestMail() {
  sendingTestMail.value = true;
  validator.value.validate({ testMail: testMail.value }, 1);

  if (validator.value.hasErrors()) {
    sendingTestMail.value = false;
    return;
  }

  const { data, error } = await useFetch(
    `/api/ant-mailer-module/send-test-mail/${props.mailTemplateId}`,
    {
      method: 'POST',
      body: {
        testMail: testMail.value,
      },
      headers: useContextHeader(props.context),
    }
  );

  if (error.value) {
    // TODO:: does not work client side?
    throw createError(error.value.data);
  }

  if (data.value.error) {
    $toaster.toastError(data.value.error);
  }

  if (data.value.default) {
    $toaster.toastSuccess('E-Mail versendet');
  }

  sendingTestMail.value = false;
}
</script>

<template>
  <AntForm @submit.prevent="onSendTestMail">
    <div class="flex items-center transition-opacity">
      <div
        data-cy="test-mail"
        class="grow"
      >
        <AntInput
          v-model:value="testMail"
          label="E-Mail Template testen"
          :errors="validator.errorMap['testMail']"
          description="Mehrere E-Mails mit Komma separiert angeben"
          placeholder="E-Mail"
          class="rounded-none rounded-bl-md rounded-tl-md"
          :validator="() => validator.validateProperty('testMail', testMail, 1)"
          :loading="loading"
          :disabled="sendingTestMail"
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

          <AntButton
            :primary="false"
            type="submit"
            data-cy="testing"
            class="!rounded-none !rounded-br-md !rounded-tr-md -ml-px w-20"
          >
            Send
          </AntButton>
        </AntInput>
      </div>
    </div>
  </AntForm>
</template>
