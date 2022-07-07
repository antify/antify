<script setup lang="ts">
import { LocationAsRelativeRaw } from 'vue-router';

const { to } = defineProps<{ to: LocationAsRelativeRaw }>();
const _to = ref(useBuildTenantLink(to, useRoute()));
</script>

<template>
    <nuxt-link :to="_to">
        <slot />
    </nuxt-link>
</template>