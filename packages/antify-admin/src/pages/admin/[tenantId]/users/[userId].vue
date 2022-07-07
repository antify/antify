<script setup lang="ts">
import { UserResponse } from '~~/server/api/users/me.get';

const { data: user } = await useFetch<UserResponse>(`/api/users/${useRoute().params.userId}`, useDefaultFetchOpts());
const { data: roles } = await useFetch(`/api/roles/roles`, useDefaultFetchOpts());

const { $toaster } = useNuxtApp();
const onSubmit = async () => {
    const { data: response } = await useFetch(`/api/users/${user.value.id}`, {
        ...useDefaultFetchOpts(),
        ...{
            method: 'PUT',
            body: user.value
        }
    });

    // TODO:: override user with response data
    $toaster.toastUpdated();
}
</script>

<template>
    <div>
        <form @submit.prevent="onSubmit">
            <div data-cy="name">
                <input v-model="user.name">
            </div>

            <div data-cy="email">
                <input v-model="user.email">
            </div>

            <div data-cy="roles">
                <select v-model="user.roleId">
                    <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
                </select>
            </div>

            <button type="submit" data-cy="submit">Speichern</button>
        </form>
    </div>
</template>