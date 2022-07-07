<script lang="ts">
export default {
  name: 'AntUpload',
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { uuid } from 'vue3-uuid';

const emit = defineEmits(['update:value']);

const props = defineProps({
  id: {
    type: String,
  },
  label: {
    type: String,
  },
  acceptType: {
    type: String,
    default: '*',
  },
  icon: {
    type: Object,
  },
  iconClass: {
    type: String,
  },
  value: {
    type: Object,
  },
  showPreview: {
    type: Boolean,
    default: false,
  },
});

const _id = computed(() => {
  return props.id ? props.id : uuid.v4();
});

const uploaded = ref({
  src: '',
  fileName: '',
});

const _value = computed({
  get: () => {
    return props.value;
  },
  set: (val) => {
    console.log('uploaded', val.target.files);
    emit('update:value', val);
    uploaded.value.src = URL.createObjectURL(val.target.files[0]);
    uploaded.value.fileName = val.target.files[0].name;
  },
});
</script>

<template>
  <div class="flex">
    <slot name="preview" v-bind="uploaded">
      <div class="left-0 m-2 flex flex-col items-center justify-center">
        <img
          v-if="uploaded.src && showPreview"
          :src="uploaded.src"
          alt="Preview"
          class="w-16 h-16"
        />

        <slot name="filename" v-bind="uploaded">
          <p class="text-ellipsis overflow-hidden whitespace-nowrap max-w-16">
            {{ uploaded.fileName }}
          </p>
        </slot>
      </div>
    </slot>

    <label
      :for="_id"
      class="
        py-3
        border-2 border-dashed
        w-full
        text-center
        flex
        items-center
        justify-center
        text-gray-400
        hover:text-gray-600
        hover:border-gray-600
        transition-all
        duration-500
        flex-wrap
        cursor-pointer
        relative
      "
    >
      <slot name="label">{{ label }}</slot>

      <slot name="icon">
        <fa-icon
          v-if="icon"
          :icon="icon"
          class="block w-full h-10"
          :class="iconClass"
        />
      </slot>
    </label>

    <input
      @change="(val) => (_value = val)"
      :id="_id"
      :accept="acceptType"
      class="hidden"
      type="file"
      v-bind="$attrs"
    />
  </div>
</template>
