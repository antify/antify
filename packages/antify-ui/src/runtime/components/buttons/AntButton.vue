<script>
import { reactive, computed } from 'vue';

export default {
  name: 'AntButton',

  props: {
    label: {
      type: String,
    },
    primary: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      validator: function (value) {
        return ['small', 'medium', 'large'].indexOf(value) !== -1;
      },
    },
    backgroundColor: {
      type: String,
    },
    icon: {
      type: Object,
    },
  },

  emits: ['click'],

  setup(props, { emit }) {
    props = reactive(props);

    return {
      classes: computed(() => ({
        'inline-flex items-center px-2.5 py-1.5 border border-transparent font-medium rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all': true,
        'text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500':
          props.primary,
        'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500':
          !props.primary,
        'text-xs': props.size === 'small',
        'text-xl': props.size === 'large',
      })),
      style: computed(() => ({
        backgroundColor: props.backgroundColor,
      })),
      onClick() {
        emit('click');
      },
    };
  },
};
</script>

<template>
  <button type="button" :class="classes" @click="onClick" :style="style">
    <slot name="label">{{ label }}</slot>

    <fa-icon v-if="icon" class="pl-2" :icon="icon" />
  </button>
</template>
