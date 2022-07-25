<script lang="ts" setup>
import { faList, faTableCellsLarge } from '@fortawesome/free-solid-svg-icons';
import MediaTable from './MediaTable.vue';
import { Default } from '~~/glue/api/admin/[tenantId]/media/index.get';

defineEmits(['reloadMedia']);
defineProps<{
  mediaFiles?: Default[];
}>();

const route = useRoute();
const router = useRouter();

// Should be in route to save on open and close detail
const activeListStyle = ref<string>(
  (route.query?.activeListStyle as string) || 'table'
);

const changeMediaListStyle = (value) => {
  activeListStyle.value = value;

  router.push({
    name: 'admin-tenantId-media',
    query: {
      ...route.query,
      activeListStyle: value,
    },
  });
};

const openMediaDetails = (item: Default) => {
  router.push({
    name: 'admin-tenantId-media-mediaId',
    params: { mediaId: item.id },
    query: route.query,
  });
};

const onSearch = (val) => {
  router.push({
    name: 'admin-tenantId-media',
    query: {
      ...route.query,
      search: val,
    },
  });
};
</script>

<template>
  <AntMediathek @search="onSearch">
    <template #filters>
      <div
        class="text-gray-500 hover:text-gray-800 transition-all duration-300 cursor-pointer"
        :class="{ 'text-gray-800': activeListStyle === 'table' }"
        @click="changeMediaListStyle('table')"
      >
        <fa-icon :icon="faList" />
      </div>

      <div
        class="text-gray-500 hover:text-gray-800 transition-all duration-300 cursor-pointer"
        :class="{ 'text-gray-800': activeListStyle === 'cells' }"
        @click="changeMediaListStyle('cells')"
      >
        <fa-icon :icon="faTableCellsLarge" />
      </div>
    </template>

    <div
      class="w-full grid lg:grid-cols-6 sm:grid-cols-4 grid-cols-2 gap-4 p-2"
      v-if="activeListStyle === 'cells'"
    >
      <AntMediathekItem
        class="w-full"
        v-for="item in mediaFiles || []"
        @click="openMediaDetails(item)"
      >
        <template #icon>
          <img v-if="item.url" :src="item.url" />
          <!-- <fa-icon v-else :icon="item.icon" /> -->
        </template>

        <template #title>
          <span :title="item.title">{{ item.title }}</span>
        </template>
      </AntMediathekItem>
    </div>

    <div class="w-full" v-if="activeListStyle === 'table'">
      <MediaTable
        :media-files="mediaFiles"
        :show-delete="true"
        :show-preview="true"
        @reload-media="$emit('reloadMedia')"
      />
    </div>
  </AntMediathek>
</template>
