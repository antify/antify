<script setup lang="ts">
import { Response as GetResponse } from '../../../../glue/api/mail_templates/[mailTemplateId].get';
import {
  validator as baseValidator,
  Response as PutResponse,
} from '../../../../glue/api/mail_templates/[mailTemplateId].put';
import TenantLink from '../../../../components/fields/TenantLink.vue';
import MailTemplatesTable from '~~/components/entity/mail-templates/MailTemplatesTable.vue';
import { validator as sendTestMailValidator } from '~~/glue/api/mail_templates/[mailTemplateId]/send_test_mail.post';
import { AntTabsType, AntSkeleton } from '@antify/antify-ui';

const { $toaster, hook } = useNuxtApp();

const errors = ref([]);
const search = ref('');
const testMail = ref('');
const validator = ref(baseValidator);
const loading = ref(true);
const saving = ref(false);
const sendingTestMail = ref(false);
const sendTestMailValidatorRef = ref(sendTestMailValidator);
const tabs = ref<AntTabsType[]>([
  {
    name: 'Stammdaten',
    current: true,
    to: '',
  },
]);
const mailTemplates = ref<GetResponse>({
  default: {},
});

let refresh: Function;

onMounted(async () => {
  const { data, refresh: mailTemplateRefresh } = await useFetch<
    GetResponse | PutResponse
  >(
    `/api/mail_templates/${useRoute().params.mailTemplateId}`,
    useDefaultFetchOpts()
  );

  refresh = mailTemplateRefresh;

  mailTemplates.value = data.value as GetResponse;

  loading.value = false;
});

async function onSubmit() {
  saving.value = true;
  errors.value = [];

  validator.value.validate(mailTemplates.value.default, 1);

  if (validator.value.hasErrors()) {
    saving.value = false;
    return;
  }

  const { data: response } = await useFetch<PutResponse>(
    `/api/mail_templates/${useRoute().params.mailTemplateId}`,
    {
      ...useDefaultFetchOpts(),
      ...{
        method: 'PUT',
        body: mailTemplates.value.default,
      },
    }
  );

  refresh();
  $toaster.toastUpdated();

  if (response.value.badRequest) {
    $toaster.toastError(response.value.badRequest.errors.join('\n'));
  }

  saving.value = false;
}

async function onSendTestMail() {
  sendingTestMail.value = true;
  sendTestMailValidatorRef.value.validate({ testMail: testMail.value }, 1);

  if (sendTestMailValidatorRef.value.hasErrors()) {
    sendingTestMail.value = false;
    return;
  }

  await useFetch(
    `/api/mail_templates/${useRoute().params.mailTemplateId}/send_test_mail`,
    {
      ...useDefaultFetchOpts(),
      method: 'POST',
      body: {
        testMail: testMail.value,
      },
    }
  );

  $toaster.toastSuccess('E-Mail versendet');
  sendingTestMail.value = false;
}

hook('page:start', () => {
  loading.value = true;
});
</script>

<template>
  <div>
    <AntDualContent>
      <template #mainHead>
        <AntTabs :tabs="tabs" />
      </template>

      <template #mainBody>
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

        <AntForm
          @submit.prevent="onSubmit"
          class="space-y-0"
          id="mail-template-form"
        >
          <div class="transition-opacity space-y-4 mt-0">
            <div data-cy="title">
              <AntInput
                v-model:value="mailTemplates.default.title"
                label="Bezeichnung"
                :errors="validator.errorMap['title']"
                :validator="
                  () =>
                    validator.validateProperty(
                      'title',
                      mailTemplates.default.title,
                      1
                    )
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
                v-model:data="mailTemplates.default.content"
                label="Inhalt"
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
        </AntForm>

        <AntForm @submit.prevent="onSendTestMail">
          <div class="flex items-center transition-opacity">
            <div
              data-cy="test-mail"
              class="grow"
            >
              <AntInput
                v-model:value="testMail"
                label="E-Mail Template testen"
                :errors="sendTestMailValidatorRef.errorMap['testMail']"
                description="Mehrere E-Mails mit Komma separiert angeben"
                placeholder="E-Mail"
                class="rounded-none rounded-bl-md rounded-tl-md"
                :validator="
                  () =>
                    sendTestMailValidatorRef.validateProperty(
                      'testMail',
                      testMail,
                      1
                    )
                "
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
                  Senden
                </AntButton>
              </AntInput>
            </div>
          </div>
        </AntForm>
      </template>

      <template #mainFooter>
        <AntButton>
          <TenantLink :to="{ name: 'backoffice-tenantId-mail-templates' }">
            Zurück
          </TenantLink>
        </AntButton>

        <AntButton
          :primary="true"
          type="submit"
          data-cy="submit"
          form="mail-template-form"
        >
          Speichern
        </AntButton>
      </template>

      <template #asideHead>
        <AntInput
          v-model:value="search"
          placeholder="Suche"
        />
      </template>

      <template #asideBody>
        <MailTemplatesTable />
      </template>
    </AntDualContent>
  </div>
</template>
