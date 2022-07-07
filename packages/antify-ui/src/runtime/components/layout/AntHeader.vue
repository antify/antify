<script lang="ts">
export default {
  name: 'AntHeader',
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
const { label, headerType } = defineProps({
  label: {
    type: String,
  },
  headerType: {
    type: String,
    validator: function (value) {
      return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].indexOf(value) !== -1;
    },
    required: true,
  },
});

const classes = () => ({
  '': true,
  'text-xl font-medium': headerType === 'h1',
  'text-lg font-bold': headerType === 'h2',
  'text-lg font-semibold': headerType === 'h3',
  'text-lg font-medium': headerType === 'h4',
  'text-md font-bold': headerType === 'h5',
  'text-md font-semibold': headerType === 'h6',
});
</script>

<template>
  <component :is="headerType" :class="classes()">{{ label }}</component>
</template>
