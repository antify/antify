<script lang="ts" setup>
import TenantLink from '~~/components/fields/TenantLink.vue';

type Role = {
    id: string,
    name: string,
    isAdmin: boolean,
    permissions: [{
        id: string,
        name: string
    }]
}
type Permission = {
    id: string,
    name: string
}

const { $toaster } = useNuxtApp();
const { role, permissions } = defineProps<{
    role: Role,
    permissions: Permission[]
}>();
const onSubmit = () => role.id ? onUpdate() : onCreate();
const onUpdate = async () => {
    const { data: response } = await useFetch(`/api/roles/${role.id}`, {
        ...useDefaultFetchOpts(),
        ...{
            method: 'PUT',
            body: role
        }
    });

    // TODO:: override role with response data
    $toaster.toastUpdated();
}
const onCreate = async () => {
    const { data: response } = await useFetch(`/api/roles/roles`, {
        ...useDefaultFetchOpts(),
        ...{
            method: 'POST',
            body: role
        }
    });

    // TODO:: override role with response data
    $toaster.toastCreated();
}
</script>

<template>
    <form @submit.prevent="onSubmit">
        <div>
            <input v-model="role.name">
        </div>

        <div v-for="permission in permissions" :key="permission.id">
            <label>
                <input v-if="role.isAdmin" type="checkbox" checked disabled />
                <input v-else type="checkbox" :value="permission.id" v-model="role.permissions" />
                {{ permission.name }}
            </label>
        </div>

        <TenantLink :to="{name: 'admin-tenantId-roles'}">Zurück</TenantLink>
        <button type="submit">Speichern</button>
    </form>
</template>