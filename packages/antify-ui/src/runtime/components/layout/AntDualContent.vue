<script lang="ts">
export default {
  name: 'AntDualContent',
  inheritAttrs: false,
};
</script>

<script lang="ts" setup></script>

<template>
  <div class="h-full flex">
    <main
      class="
        h-screen
        max-h-screen
        flex flex-col flex-1
        relative
        z-0
        overflow-y-auto
        focus:outline-none
        md::order-last
      "
    >
      <div class="border-b grow-0 shrink-0 basis-auto pl-10 md:pl-0">
        <slot name="mainHead"></slot>
      </div>

      <div class="grow shrink-0 overflow-y-auto basis-auto">
        <slot name="mainBody"></slot>
      </div>

      <div class="grow-0 shrink-0 basis-auto">
        <slot name="mainFooter"></slot>
      </div>
    </main>

    <aside
      class="
        hidden
        md:flex
        relative
        md:order-first
        md:flex-col
        flex-shrink-0
        w-96
        border-r border-gray-200
        h-screen
        max-h-screen
        flex flex-col
      "
    >
      <div class="border-b grow-0 shrink-0 basis-auto pl-10 md:pl-0">
        <slot name="asideHead"></slot>
      </div>

      <div class="grow shrink-0 overflow-y-auto basis-auto">
        <slot name="asideBody"></slot>
      </div>

      <div class="grow-0 shrink-0 basis-auto">
        <slot name="asideFooter"></slot>
      </div>
    </aside>
  </div>
</template>
