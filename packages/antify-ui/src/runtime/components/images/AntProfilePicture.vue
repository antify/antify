<script lang="ts">
export default {
  name: 'AntProfilePicture',
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { reactive, computed } from 'vue';
const { imageUrl, alt, size } = defineProps({
  imageUrl: {
    type: String,
  },
  alt: {
    type: String,
  },
  size: {
    type: String,
    validator: function (value) {
      return ['small', 'medium', 'large'].indexOf(value) !== -1;
    },
  },
});

const classes = computed(() => ({
  'rounded-full block overflow-hidden': true,
  'w-8': size === 'small',
  'w-12': !size || size === 'medium',
  'w-16': size === 'large',
}));
</script>

<template>
  <div :class="classes">
    <img :src="imageUrl" :alt="alt" />
  </div>
</template>
