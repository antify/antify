<script lang="ts">
export default {
  name: 'AntProgress',
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
const { id, value, fullValue, label } = defineProps({
  id: {
    type: String,
    default: '',
  },
  value: {
    type: Number,
    default: 0,
  },
  fullValue: {
    type: Number,
    default: 100,
  },
  label: {
    type: String,
  },
});

const current = (value * 100) / fullValue;
</script>

<template>
  <div class="text-xs text-gray-500 flex justify-between">
    <span>{{ label }}</span>
    <span
      >{{ value.toLocaleString(undefined, {}) }}/{{
        fullValue.toLocaleString(undefined, {})
      }}
    </span>
  </div>

  <div
    class="
      w-full
      bg-gray-400
      h-2
      flex
      justify-center
      items-center
      relative
      overflow-hidden
      rounded
    "
  >
    <div
      :style="`width: ${current}%`"
      class="bg-blue-600 h-full absolute left-0 transition-all rounded"
    />

    <slot />
  </div>
</template>
