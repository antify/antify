<script setup lang='ts'>
import AntNoteModuleNoteListing from './AntNoteModuleNoteListing.vue';
import AntNoteAccordion from './AntNoteAccordion.vue';
import AntNoteAccordionItem from './AntNoteAccordionItem.vue';

const props = withDefaults(defineProps<{
  provider: string;
  tenantId?: string;
  title?: string;
}>(), {
  title: 'Notes'
});
</script>

<template>
  <div class='bg-white border border-gray-200 rounded h-full box-border flex flex-col w-full'>
    <div class='p-2'>
      {{ title }}
    </div>

    <AntNoteAccordion class='flex-grow overflow-hidden'>
      <AntNoteAccordionItem title='MY NOTES'>
        <AntNoteModuleNoteListing
          :provider='provider'
          :tenant-id='tenantId'
          :is-global-visible='false'
        />
      </AntNoteAccordionItem>

      <AntNoteAccordionItem title='GENERAL NOTES'>
        <AntNoteModuleNoteListing
          :provider='provider'
          :tenant-id='tenantId'
          :is-global-visible='true'
        />
      </AntNoteAccordionItem>
    </AntNoteAccordion>
  </div>
</template>
