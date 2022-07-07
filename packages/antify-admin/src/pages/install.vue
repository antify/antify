<script setup lang="ts">
import { appInstallPostValidator, AppInstallPostInput } from '~~/glue/api/app/install.post';

// Check if there is something to insall
const { data } = await useFetch('/api/app/install_required', {
    headers: {
        'content-type': 'application/json'
    }
});

if (!data.value.requireInstall) {
    await navigateTo({ name: 'login' });
}

const errors = ref([]);
const loading = ref<Boolean>(false);
const validator = ref(appInstallPostValidator);
const user = ref<AppInstallPostInput>({ name: '', email: '', password: '' });
const replyPassword = ref('');
const onSubmit = async () => {
    loading.value = true;
    errors.value = [];

    validator.value.validate(user.value, true);

    if (validator.value.hasErrors()) {
        loading.value = false;
        return;
    }

    const { data, error } = await useFetch('/api/app/install', {
        method: 'POST',
        body: user.value,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    loading.value = false;

    if (data.value.default) {
        await navigateTo({ name: 'admin' });
    }

    if (data.value.badRequest || data.value.installNotPossible) {
        errors.value = data.value.badRequest?.errors || data.value.installNotPossible.errors;

        user.value.name = '';
        user.value.email = '';
        user.value.password = '';
    }
}
</script>

<template>
    <div>
        <h1>Install</h1>

        <ul data-cy="response-errors" v-if="errors.length"
            style="background: #dc2626; color: #fff; padding: 20px; list-style-position: inside;">
            <li v-for="error in errors">{{ error }}</li>
        </ul>

        <form @submit.prevent="onSubmit">
            <div data-cy="name">
                <label>
                    Name <br />
                    <input v-model="user.name" placeholder="Name" autofocus
                        @input="() => validator.validateProperty('name', user.name, true)" />
                </label>

                <div data-cy="error" v-for="message in validator.errorMap['name']">{{ message }}</div>
            </div>

            <div data-cy="email">
                <label>
                    E-Mail <br />
                    <input v-model="user.email" type="text" placeholder="E-Mail"
                        @input="() => validator.validateProperty('email', user.email, true)" />
                </label>

                <div data-cy="error" v-for="message in validator.errorMap['email']">{{ message }}</div>
            </div>

            <div data-cy="password">
                <label>
                    Passwort <br />
                    <input v-model="user.password" type="password" placeholder="Passwort"
                        @input="() => validator.validateProperty('password', user.email, true)" />
                </label>

                <div data-cy="error" v-for="message in validator.errorMap['password']">{{ message }}</div>
            </div>

            <div data-cy="password-repeat">
                <label>
                    Passwort wiederholen <br />
                    <input v-model="replyPassword" type="password" placeholder="Passwort wiederholen" />
                </label>
            </div>

            <button data-cy="submit" type="submit">Speichern</button>
        </form>
    </div>
</template>