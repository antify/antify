<script lang="ts" setup>
const { data, refresh, error } = await useFetch('/api/test', {
  headers: {
    ...useContextHeader('core'),
  },
});

if (error.value) {
  throw createError(error.value.data);
}

const addTestEntry = async () => {
  await useFetch('/api/test', {
    method: 'post',
    headers: {
      ...useContextHeader('core'),
    },
  });

  refresh();
};
</script>

<template>
  <button @click="() => addTestEntry()">Add test entry</button>

  <h2>Entries</h2>
  <ul>
    <li v-for="testItem in data">{{ testItem.title }}</li>
  </ul>
</template>
