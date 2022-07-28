<script
  lang="ts"
  setup
>
import { ref } from 'vue';
import UserTable from '~~/components/entity/user/UserTable.vue';

const route = useRoute();
const router = useRouter();
const { $toaster } = useNuxtApp();

const inviteUserActive = ref(false);
const inviteEmail = ref('');

const search = computed({
  get() {
    return route.query.search || '';
  },
  set(val) {
    router.push({
      name: route.name,
      query: {
        ...route.query,
        search: val,
      },
    });
  },
});

async function inviteUser() {
  await useFetch(`/api/users/invite_user`, {
    ...useDefaultFetchOpts(),
    ...{
      method: 'POST',
      body: {
        email: inviteEmail.value,
      },
    },
  });

  $toaster.toastSuccess('Einladung wurde versendet');
  inviteUserActive.value = false;
}
</script>

<template>
  <AntContent>
    <template #head>
      <div class="flex justify-between items-center w-full space-x-8">
        <AntInput
          class="w-1/2"
          v-model:value="search"
          placeholder="Suche"
        />

        <AntButton
          :primary="true"
          class="whitespace-nowrap"
          @click="inviteUserActive = true"
        >
          Benutzer einladen
        </AntButton>
      </div>
    </template>

    <template #body>
      <UserTable :single-col="false" />

      <AntModal
        v-model:active="inviteUserActive"
        title="Neuen Benutzer einladen"
      >
        <AntForm
          id="invite-user-form"
          @submit.prevent="inviteUser"
        >
          <AntInput
            v-model:value="inviteEmail"
            label="E-Mail Adresse"
            description="Geben Sie die E-Mail-Adresse des Nutzers ein den Sie einladen möchten"
          />
        </AntForm>

        <template #buttons>
          <AntButton
            label="Schließen"
            @click="inviteUserActive = false"
          />

          <AntButton
            type="submit"
            form="invite-user-form"
            primary
          >
            Benutzer einladen
          </AntButton>
        </template>
      </AntModal>
    </template>
  </AntContent>
</template>
