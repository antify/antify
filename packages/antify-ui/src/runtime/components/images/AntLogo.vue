<script lang="ts">
export default {
  name: 'AntLogo',
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { computed } from 'vue';

const { logoUrl, alt, size } = defineProps({
  logoUrl: {
    type: String,
  },
  alt: {
    type: String,
    default: 'Logo',
  },
  size: {
    type: String,
    validator: function (value) {
      return ['small', 'medium', 'large'].indexOf(value) !== -1;
    },
    default: 'medium',
  },
});

const classes = computed(() => ({
  'block overflow-hidden': true,
  'h-6': size === 'small',
  'h-8': size === 'medium',
  'h-12': size === 'large',
}));
</script>

<template>
  <div :class="classes">
    <img class="h-full" :src="logoUrl" :alt="alt" />
  </div>
</template>
