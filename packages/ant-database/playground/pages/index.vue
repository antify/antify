<script setup lang="ts">
const { data, refresh } = await useFetch('/api/users');
</script>

<template>
  <div class="p-5">
    <h1>All users</h1>
    <pre>{{ data }}</pre>

    <button @click="() => refresh()">Reload</button>
  </div>
</template>
