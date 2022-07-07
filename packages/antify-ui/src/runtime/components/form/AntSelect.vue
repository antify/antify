<script lang="ts">
export default {
  name: 'AntSelect',
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
const {} = defineProps({
  id: {
    type: String,
  },
  label: {
    type: String,
  },
  placeholder: {
    type: String,
  },
  options: {
    type: Array,
  },
  showLabel: {
    type: Boolean,
    default: true,
  },
  value: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div>
    <label
      v-if="showLabel"
      :for="id"
      class="block text-sm font-medium text-gray-700"
    >
      <span>{{ label }}</span>
    </label>

    <select
      :id="id"
      :placeholder="placeholder"
      v-model="value"
      class="
        mt-1
        block
        w-full
        pl-3
        pr-10
        py-2
        text-base
        border-gray-300
        focus:outline-none
        focus:ring-indigo-500
        focus:border-indigo-500
        sm:text-sm
        rounded-md
      "
      v-bind="$attrs"
      @change="() => $emit('update:value', value)"
    >
      <option
        v-for="(option, index) in options"
        :key="`${id}-${index}`"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
