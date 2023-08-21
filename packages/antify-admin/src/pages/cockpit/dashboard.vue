<template>
  <AntContent>
    <template #head>
      <AntHeader>Dashboard</AntHeader>
    </template>

    <template #body>
      <div class="p-4 h-screen bg-gray-50 p-2 box-border flex space-x-2">
        <AntNoteModuleNoteWidget provider='core' />

        <div class='w-full'></div>
        <div class='w-full'></div>
        <div class='w-full'></div>
      </div>
    </template>
  </AntContent>
</template>
<script setup lang='ts'>
</script>
