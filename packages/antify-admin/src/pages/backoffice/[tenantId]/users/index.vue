<script lang="ts" setup>
import UserTable from '~~/components/backoffice/user/UserTable.vue';
import InviteUser from '~~/components/backoffice/user/InviteUser.vue';

const route = useRoute();
const router = useRouter();
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
</script>

<template>
  <AntContent>
    <template #head>
      <div class="flex justify-between items-center w-full space-x-8">
        <AntInput
          class="w-1/2"
          v-model:value="search"
          placeholder="Search"
        />

        <!-- <InviteUser /> -->
      </div>
    </template>

    <template #body>
      <UserTable :single-col="false" />
    </template>
  </AntContent>
</template>
