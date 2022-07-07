<script setup>
const { data: permissions } = await useFetch('/api/roles/permissions', useDefaultFetchOpts());
const role = {
    name: '',
    permissions: []
};
</script>

<template>
    <div>
        <EntityRoleEditRoleForm :role="role" :permissions="permissions" />
    </div>
</template>