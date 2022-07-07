<script lang="ts">
export default {
  name: 'AntTextarea',
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
const props = defineProps({
  id: {
    type: String,
  },
  label: {
    type: String,
  },
  placeholder: {
    type: String,
  },
  showLabel: {
    type: Boolean,
    default: true,
  },
});

console.log('label', props.label);
</script>

<template>
  <label
    v-if="showLabel && label"
    :for="`textarea-${id}`"
    class="block text-sm font-medium text-gray-700"
  >
    <span>{{ label }}</span>
  </label>

  <div :class="{ 'mt-1': showLabel && label }">
    <textarea
      v-bind="$attrs"
      :id="`textarea-${id}`"
      :placeholder="placeholder || label"
      rows="4"
      class="
        shadow-sm
        focus:ring-indigo-500
        focus:border-indigo-500
        block
        w-full
        sm:text-sm
        border-gray-300
        rounded-md
      "
    />
  </div>
</template>
