<script setup>
const tenants = useTenantState();
const route = useRoute();

const tenantId = computed({
    get: () => {
        return route.params.tenantId;
    },
    set: (val) => {
        navigateTo({
            ...useRoute(),
            ...{ params: { tenantId: val } }
        });
    }
})
</script>

<template>
    <select class="w-full" v-model="tenantId" @input="onChangeTenant" data-cy="CurrentTenantSelectField">
        <option v-for="tenant in tenants" :value="tenant.id">{{ tenant.name }}</option>
    </select>
</template>