<script setup lang="ts">
import { Response as GetResponse } from '../../../../glue/api/mail_templates/[mailTemplateId].get';
import {
  validator as baseValidator,
  Response as PutResponse,
} from '../../../../glue/api/mail_templates/[mailTemplateId].put';
import TenantLink from '../../../../components/fields/TenantLink.vue';
import MailTemplatesTable from '~~/components/entity/mail-templates/MailTemplatesTable.vue';

const { data } = await useFetch<GetResponse | PutResponse>(
  `/api/mail_templates/${useRoute().params.mailTemplateId}`,
  useDefaultFetchOpts()
);

// if (!data.value?.default) {
//   // TODO:: Handle it
//   throw throwError('HANDLE ME');
// }

const { $toaster } = useNuxtApp();
const errors = ref([]);
const loading = ref<Boolean>(false);
const validator = ref(baseValidator);
const search = ref('');

const onSubmit = async () => {
  loading.value = true;
  errors.value = [];

  validator.value.validate(data.value.default, 1);

  if (validator.value.hasErrors()) {
    loading.value = false;
    return;
  }

  const { data: response } = await useFetch<PutResponse>(
    `/api/mail_templates/${useRoute().params.mailTemplateId}`,
    {
      ...useDefaultFetchOpts(),
      ...{
        method: 'PUT',
        body: data.value.default,
      },
    }
  );
  loading.value = false;

  if (response.value.default) {
    data.value = response.value;
    $toaster.toastUpdated();
  }

  if (response.value.badRequest) {
    $toaster.toastError(response.value.badRequest.errors.join('\n'));
  }
};
</script>

<template>
  <AntDualContent>
    <template #mainHead>
      <AntHeader>E-Mail Template bearbeiten</AntHeader>
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

      <AntForm @submit.prevent="onSubmit" id="mail-template-form">
        <div data-cy="title">
          <AntInput
            v-model:value="data.default.title"
            label="Bezeichnung"
            :errors="validator.errorMap['title']"
            :validator="
              () => validator.validateProperty('title', data.default.title, 1)
            "
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

        <div data-cy="content">
          <AntRichTextEditor
            v-model:data="data.default.content"
            label="Inhalt"
            :errors="validator.errorMap['content']"
            :validator="(val: string) => validator.validateProperty('content', val, 1)"
          >
            <template #errorList="{ errors }">
              <div data-cy="error" v-for="message in errors">
                {{ message }}
              </div>
            </template>
          </AntRichTextEditor>
        </div>
      </AntForm>
    </template>

    <template #mainFooter>
      <AntButton>
        <TenantLink :to="{ name: 'admin-tenantId-mail-templates' }">
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
      <AntInput v-model:value="search" placeholder="Suche" />
    </template>

    <template #asideBody>
      <MailTemplatesTable />
    </template>
  </AntDualContent>
</template>
