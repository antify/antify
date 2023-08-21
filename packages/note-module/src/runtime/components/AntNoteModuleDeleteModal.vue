<script setup lang='ts'>
const props = withDefaults(defineProps<{
  visible: boolean;
  title?: string;
  loading?: boolean;
}>(), {
  title: 'Delete note',
  loading: false
});
const emit = defineEmits(['update:visible', 'submit']);

function closeModal() {
  emit('update:visible', false);
}
</script>

<template>
  <div v-if='visible'
       class='absolute top-0 left-0 w-screen h-screen backdrop-blur bg-black/50 flex justify-center items-center overflow-hidden z-50'>
    <div class='bg-white min-w-[25%] min-h-[25%] rounded flex flex-col'>
      <div class='flex justify-between p-2'>
        <div>{{ title }}</div>

        <div>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            height='1.5em'
            viewBox='0 0 384 512'
            class='cursor-pointer'
            @click='closeModal'
          >
            <path
              d='M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z' />
          </svg>
        </div>
      </div>

      <div class='flex space-x-2 p-2 flex-grow'>
        <svg xmlns='http://www.w3.org/2000/svg' height='2em' viewBox='0 0 512 512'>
          <path
            d='M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z' />
        </svg>

        <div>
          <slot />
        </div>
      </div>

      <div class='flex justify-between p-2'>
        <div></div>
        <div class='space-x-2'>
          <button
            class='bg-white border border-gray-300 text-slate-500 p-2 rounded hover:drop-shadow-lg'
            @click='closeModal'
          >
            Cancel
          </button>
          <button
            class='bg-red-500 border border-red-500 p-2 rounded text-white hover:drop-shadow-lg'
            :disabled='loading'
            @click='() => $emit("submit")'
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
