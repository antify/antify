<script setup>
import TenantLink from '~~/components/fields/TenantLink.vue';

const { data: roles } = await useFetch('/api/roles/roles', useDefaultFetchOpts());
</script>

<template>
    <div>
        <TenantLink :to="{name: 'admin-tenantId-roles-create'}">Hinzufügen</TenantLink>

        <table>
            <thead>
                <tr>
                    <th>Rollen</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="role in roles" :key="role.id">
                    <td>
                        <TenantLink :to="{ name: 'admin-tenantId-roles-roleId', params: { roleId: role.id } }">
                            {{ role.name }}
                        </TenantLink>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>