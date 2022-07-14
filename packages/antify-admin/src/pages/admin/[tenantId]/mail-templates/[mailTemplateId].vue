<script setup lang="ts">
import { Response as GetResponse } from "../../../../glue/api/mail_templates/[mailTemplateId].get";
import { validator as baseValidator, Response as PutResponse } from "../../../../glue/api/mail_templates/[mailTemplateId].put";
import TenantLink from "../../../../components/fields/TenantLink.vue";

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
const onSubmit = async () => {
  loading.value = true;
  errors.value = [];

  validator.value.validate(data.value.default, true);

  if (validator.value.hasErrors()) {
    loading.value = false;
    return;
  }

  const { data: response } = await useFetch<PutResponse>(
    `/api/mail_templates/${useRoute().params.mailTemplateId}`,
    {
      ...useDefaultFetchOpts(),
      ...{
        method: "PUT",
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
  <div>
    <ul data-cy="response-errors" v-if="errors.length" style="
        background: #dc2626;
        color: #fff;
        padding: 20px;
        list-style-position: inside;
      ">
      <li v-for="error in errors">{{ error }}</li>
    </ul>

    <form @submit.prevent="onSubmit">
      <div data-cy="title">
        <label>
          Bezeichnung <br />
          <input v-model="data.default.title" placeholder="Titel" autofocus
            @input="() => validator.validateProperty('title', data.default.title, true)" />
        </label>

        <div data-cy="error" v-for="message in validator.errorMap['title']">{{ message }}</div>
      </div>

      <div data-cy="content">
        <label>
          Inhalt <br />
          <textarea v-model="data.default.content" placeholder="Inhalt" autofocus
            @input="() => validator.validateProperty('content', data.default.content, true)"></textarea>
        </label>

        <div data-cy="error" v-for="message in validator.errorMap['content']">{{ message }}</div>
      </div>

      <TenantLink :to="{ name: 'admin-tenantId-mail-templates' }">Zurück</TenantLink> - 
      <button type="submit" data-cy="submit">Speichern</button>
    </form>
  </div>
</template>