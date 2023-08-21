<script setup lang='ts'>
import { AntSkeleton} from '@antify/antify-ui';
</script>

<template>
  <div
    class='bg-gray-50 border-gray-300 border rounded p-2 flex flex-col space-y-2'
  >
    <AntSkeleton class='h-4 w-4/5' />
    <AntSkeleton class='h-4 w-2/4' />
    <AntSkeleton class='h-4 w-full' />
    <AntSkeleton class='h-4 w-3/5' />
  </div>
</template>
