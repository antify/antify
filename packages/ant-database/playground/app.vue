<script lang="ts" setup>
const settingsData = ref();

const { data: tenants } = useFetch('/api/tenants');

const fetchSettings = (tenantId: string) => {
  const { data } = useFetch(`/api/${tenantId}/settings`);

  settingsData.value = data.value;
};
</script>

<template>
  <div>
    <h1>Nuxt module playground!</h1>

    <div class="container">
      <div>
        <h2>Load from Core</h2>
        <div v-for="tenant in tenants">
          <div>
            <pre>{{ tenant }}</pre>
            <div>
              <button @click="() => fetchSettings(tenant._id)">
                Load Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2>Load from Tenant</h2>

        <pre>{{ settingsData }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
}
</style>
