<script setup lang="ts">
import {
  validator as baseValidator,
  Response as PutResponse,
} from '~~/glue/api/cockpit/users/[userId].put';
import UserTable from '~~/components/pages/cockpit/users/UserTable.vue';
import { AntTabsType } from '@antify/antify-ui';

const route = useRoute();
const router = useRouter();
const { $toaster } = useNuxtApp();

const errors = ref([]);
const search = ref('');
const loading = ref<Boolean>(true);
const saving = ref<Boolean>(false);
const deleteDialogActive = ref<Boolean>(false);

const validator = ref(baseValidator);
const tabs = ref<AntTabsType[]>([
  {
    name: 'Stammdaten',
    current: true,
    to: '',
  },
]);

let refresh: Function;

const { data: userData, refresh: userRefresh } = await useFetch(
  `/api/pages/cockpit/users/${useRoute().params.userId}`,
  useDefaultFetchOpts()
);

refresh = userRefresh;

loading.value = false;

onMounted(async () => {});

async function onSubmit() {
  saving.value = true;
  errors.value = [];

  validator.value.validate(userData.value.default, 1);
  
  if (validator.value.hasErrors()) {
    saving.value = false;

    return;
  }

  await useFetch(`/api/pages/cockpit/users/${route.params.userId}`, {
    ...useDefaultFetchOpts(),
    ...{
      method: 'PUT',
      body: userData.value.default,
    },
  });

  saving.value = false;

  $toaster.toastUpdated();
  refresh();
}

async function deleteUser() {
  await useFetch(`/api/pages/cockpit/users/${route.params.userId}`, {
    ...useDefaultFetchOpts(),
    ...{
      method: 'DELETE',
    },
  });

  $toaster.toastDeleted();
  deleteDialogActive.value = false;

  router.push({ name: 'cockpit-users' });
}

async function banUser() {
  saving.value = true;
  await useFetch<PutResponse>(`/api/users/${route.params.userId}/ban`, {
    ...useDefaultFetchOpts(),
    ...{
      method: 'PUT',
    },
  });

  saving.value = false;

  $toaster.toastUpdated();
  refresh();
}

async function unbanUser() {
  saving.value = true;

  await useFetch<PutResponse>(`/api/users/${route.params.userId}/unban`, {
    ...useDefaultFetchOpts(),
    ...{
      method: 'PUT',
    },
  });

  saving.value = false;

  $toaster.toastUpdated();
  refresh();
}
</script>

<template>
  <div>
    <AntDualContent>
      <template #mainHead>
        <AntTabs :tabs="tabs"></AntTabs>

        <div class="flex space-x-4">
          <DeleteButton
            label="Delete"
            @click="deleteDialogActive = true"
          />

          <AntButton
            v-if="!userData.default.isBanned"
            label="Ban user"
            @click="banUser"
          />

          <AntButton
            v-if="userData.default.isBanned"
            label="Unban user"
            @click="unbanUser"
          />
        </div>
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
          <li
            v-for="(error, index) in errors"
            :key="`user-error-${index}`"
          >
            {{ error }}
          </li>
        </ul>

        <AntForm
          @submit.prevent="onSubmit"
          class="flex flex-col bg-white"
          id="user-create-form"
        >
          <div data-cy="name">
            <AntInput
              v-model:value="userData.default.name"
              label="Name"
              :errors="validator.errorMap['name']"
              :validator="(val: string) => validator.validateProperty('name', val, 1)"
            >
              <template #errorList="{ errors }">
                <div
                  data-cy="error"
                  v-for="message in errors"
                  class="text-red-600"
                >
                  {{ message }}
                </div>
              </template>
            </AntInput>
          </div>

          <div data-cy="email">
            <AntInput
              v-model:value="userData.default.email"
              label="E-Mail"
              :errors="validator.errorMap['email']"
              :validator="(val: string) => validator.validateProperty('email', val, 1)"
            >
              <template #errorList="{ errors }">
                <div
                  data-cy="error"
                  v-for="message in errors"
                  class="text-red-600"
                >
                  {{ message }}
                </div>
              </template>
            </AntInput>
          </div>

          <div>TODO:: Implement users tenant accesses</div>
        </AntForm>
      </template>

      <template #mainFooter>
        <AntButton>
          <NuxtLink
            :to="{
              name: 'cockpit-users',
            }"
          >
            Back
          </NuxtLink>
        </AntButton>

        <AntButton
          type="submit"
          data-cy="submit"
          :primary="true"
          form="user-create-form"
        >
          Save
        </AntButton>
      </template>

      <template #asideHead>
        <AntInput
          v-model:value="search"
          placeholder="Search"
        />
      </template>

      <template #asideBody>
        <UserTable :single-col="true" />
      </template>
    </AntDualContent>

    <AntModal
      v-model:active="deleteDialogActive"
      title="Delete user"
    >
      <div>
        Sind sie sicher das Sie diesen Benutzer wirklich unwiederruflich löschen
        wollen?
      </div>

      <template #buttons>
        <AntButton
          primary
          @click="deleteDialogActive = false"
        >
          Cancel
        </AntButton>

        <DeleteButton
          label="Delete"
          @click="deleteUser"
        />
      </template>
    </AntModal>
  </div>
</template>
