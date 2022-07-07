<script lang="ts">
export default {
  name: 'AntPasswordField',
};
</script>

<script setup lang="ts">
import { ref } from 'vue';
import { computed } from '@vue/reactivity';
import { faEye } from '@fortawesome/free-solid-svg-icons';

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
  rules: {
    type: Array,
    default: [],
  },
  description: {
    type: String,
  },
  placeholder: {
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

const defaultType = ref<String>('password');

const useType = computed({
  get() {
    return defaultType.value;
  },
  set(value) {
    defaultType.value = value;
  },
});

const revealPassword = () => {
  if (useType.value === 'password') {
    useType.value = 'text';
  } else {
    useType.value = 'password';
  }
};
</script>

<template>
  <label
    :for="_id"
    v-if="label"
    class="block text-sm font-medium text-gray-700"
    :class="{
      'absolute -top-2 left-2 -mt-px bg-white z-50': overlappingLabel,
    }"
  >
    {{ label }}
  </label>

  <div class="relative">
    <div
      v-if="leadingIcon"
      class="
        absolute
        inset-y-0
        left-0
        pl-3
        flex
        items-center
        pointer-events-none
      "
    >
      <fa-icon :icon="leadingIcon" class="h-5 w-5 text-gray-400" />
    </div>

    <input
      v-model="password"
      :type="useType"
      :placeholder="placeholder || label"
      class="
        appearance-none
        block
        w-full
        px-3
        py-2
        border border-gray-300
        rounded-md
        shadow-sm
        placeholder-gray-400
        focus:outline-none
        focus:ring-primary-light
        focus:border-primary-light
        sm:text-sm
      "
      :class="{
        'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500':
          error,
        'pl-10': leadingIcon,
      }"
      :aria-describedby="`${_id}-description`"
      :aria-invalid="error"
      v-bind="$attrs"
      @blur="validate"
      @input="handleInput"
    />

    <div
      v-if="showPassword"
      class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
      @click="revealPassword()"
    >
      <fa-icon
        :icon="faEye"
        class="h-5 w-5 text-gray-400 hover:text-gray-700"
        aria-hidden="true"
      />
    </div>

    <div
      v-if="error"
      class="
        absolute
        inset-y-0
        right-0
        pr-3
        flex
        items-center
        pointer-events-none
      "
    >
      <fa-icon
        :icon="faCircleExclamation"
        class="h-5 w-5 text-red-500"
        aria-hidden="true"
      />
    </div>
  </div>
</template>
