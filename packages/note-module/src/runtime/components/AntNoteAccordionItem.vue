<script setup lang='ts'>
const props = withDefaults(defineProps<{
  title: string;
  open?: boolean
}>(), {
  open: false
});
const _open = ref(!props.open);
</script>

<template>
  <div class='flex flex-col'
  >
    <div
      class='accordion-headline flex justify-between items-center p-2 bg-gray-100 cursor-pointer'
      @click='() => _open = !_open'
    >
      <span>{{ title }}</span>

      <span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          height='1em'
          viewBox='0 0 448 512'
          :class='{"rotate-180": !_open}'
        >
          <path
            d='M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z' />
        </svg>
      </span>
    </div>

    <div
      v-show='_open'
      class='bg-white '
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.accordion-headline {
  position: relative;
}

.accordion-headline:after {
  @apply border-gray-200 border;
  position: absolute;
  inset: 0 0 -1px 0;
  content: '';
  border-width: 1px 0;
}
</style>
