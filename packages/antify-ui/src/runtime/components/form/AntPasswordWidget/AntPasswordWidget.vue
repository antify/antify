<script lang="ts">
export default {
  name: 'AntPasswordWidget',
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { ref } from 'vue';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import AntPasswordField from './AntPasswordField.vue';

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
  password: {
    required: true,
  },
  label: {
    type: String,
  },
  repeatLabel: {
    type: String,
  },
  placeholder: {
    type: String,
  },
  repeatPlaceholder: {
    type: String,
  },
  rulesPassword: {
    type: Array,
    default() {
      return [
        (value) => !!value || 'Password can not be empty.',
        (value) => value.length > 8 || 'Min password length is 8 symbols',
      ];
    },
  },
  rulesPasswordRepeat: {
    type: Array,
    default() {
      return [
        (value) => !!value || 'Repeat password is required',
        (value) => value != password || 'Password needs to be the same',
      ];
    },
  },
  description: {
    type: String,
  },
  leadingIcon: {
    type: Object,
  },
  overlappingLabel: {
    type: Boolean,
    default: false,
  },
  showPassword: {
    type: Boolean,
    default: true,
  },
});

const repeatPassword = ref<string>('');
</script>

<template>
  <div>
    <div class="mt-1 relative">
      <AntPasswordField
        :id="id"
        :password.sync="password"
        :label="label"
        :rules="rules"
        :placeholder="placeholder"
        :leading-icon="leadingIcon"
        :overlapping-label="overlappingLabel"
        :show-password="showPassword"
      />

      <AntPasswordField
        :id="id"
        :password.sync="repeatPassword"
        :label="repeatLabel"
        :rules="repeatPasswordRules"
        :placeholder="repeatPlaceholder"
        :leading-icon="leadingIcon"
        :overlapping-label="overlappingLabel"
        :show-password="showPassword"
      />
    </div>
  </div>
</template>
