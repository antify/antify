<script lang="ts">
export default {
  name: 'AntTable',
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { ROW_TYPES } from '../../types/TableHeader.type';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

const emit = defineEmits(['update:data']);

const props = defineProps({
  headers: {
    type: Array,
  },
  data: {
    type: Array,
  },
  grabberIcon: {
    type: Object,
    default: faEllipsisVertical,
  },
});

const isDragging = ref<Boolean>(false);
const ghost = ref({});
const onDraggingData = ref([]);

const dragstartEvent = (event, elem, index) => {
  event.dataTransfer.dropEffect = 'move';
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData(`dragIndex`, index);

  onDraggingData.value = props.data;
  isDragging.value = true;
  ghost.value = {
    ...elem,
    id: 'ghost',
  };
  addGhost(index);
};

const dragoverEvent = (event, index) => {
  event.preventDefault();

  if (isDragging.value) {
    addGhost(index);
  }
};

const dragleaveEvent = (event, index) => {
  event.preventDefault();

  removeGhost();
};

const onDrop = (event) => {
  event.preventDefault();

  const index = getGhostIndex();

  removeGhost();

  const oldIndex = event.dataTransfer.getData('dragIndex');
  const toMove = onDraggingData.value[oldIndex];

  onDraggingData.value.splice(oldIndex, 1);
  onDraggingData.value.splice(index, 0, toMove);

  emit('update:data', onDraggingData.value);

  isDragging.value = '';
  onDraggingData.value = [];
  ghost.value = {};
};

const addGhost = (index) => {
  // Remove all ghosts before adding any new ones:
  removeGhost();

  onDraggingData.value.splice(index, 0, ghost.value);
};

const getGhostIndex = () => {
  return onDraggingData.value.findIndex((elem) => elem.id === 'ghost');
};

const removeGhost = () => {
  const index = getGhostIndex();

  if (index !== -1) {
    onDraggingData.value.splice(index, 1);
  }
};

const _data = computed(() => {
  if (isDragging.value) {
    return onDraggingData.value;
  } else {
    return props.data;
  }
});
</script>

<template>
  <div class="h-full">
    <div class="flex flex-col h-full">
      <div class="h-full">
        <div class="inline-block min-w-full align-middle h-full">
          <div
            class="
              overflow-hidden
              shadow
              ring-1 ring-black ring-opacity-5
              h-full
              overflow-x-auto overflow-y-auto
            "
          >
            <table
              class="min-w-full divide-y divide-gray-300 h-full max-h-full"
            >
              <thead class="bg-gray-50 sticky top-0 border-b">
                <tr class="">
                  <!-- TODO:: make translateable -->
                  <th class="sr-only w-1">Dragger</th>

                  <th
                    v-for="(header, index) in headers"
                    :key="`table-header-${header.identifier}-${index}`"
                    scope="col"
                    class="
                      py-3
                      pl-4
                      pr-3
                      text-left text-sm text-gray-900
                      uppercase
                      font-medium
                      sm:pl-6
                    "
                    :class="header.headerClassList"
                  >
                    {{ header.title }}
                  </th>

                  <slot name="lastHeader"></slot>
                </tr>
              </thead>

              <tbody
                dropzone="move"
                class="divide-y divide-gray-200 bg-white"
                @drop="onDrop"
              >
                <transition-group name="drag-list">
                  <tr
                    v-for="(elem, index) in _data"
                    :key="`table-row-${index}`"
                    draggable="true"
                    class="cursor-pointer select-none transition-all"
                    :class="{ 'opacity-30': elem.id === 'ghost' }"
                    @dragstart="dragstartEvent($event, elem, index)"
                    @dragover="dragoverEvent($event, index)"
                    @dragleave="dragleaveEvent($event, index)"
                  >
                    <td class="cursor-pointer w-0">
                      <fa-icon
                        :icon="grabberIcon"
                        class="
                          px-4
                          transition-all
                          text-gray-400
                          hover:text-gray-800
                        "
                      />
                    </td>

                    <td
                      v-for="(header, index) in headers"
                      :key="`table-cell-${header.identifier}-${index}`"
                      class="
                        whitespace-nowrap
                        py-2
                        pl-4
                        pr-3
                        text-sm
                        font-medium
                        text-gray-900
                        sm:pl-6
                      "
                    >
                      <div
                        v-if="header.type === ROW_TYPES.TEXT"
                        :class="header.rowClassList"
                      >
                        {{ elem[header.identifier] }}
                      </div>

                      <div
                        v-else-if="header.type === ROW_TYPES.IMAGE"
                        :class="header.rowClassList"
                      >
                        <img
                          :src="elem[header.identifier]"
                          :alt="elem[header.identifier]"
                        />
                      </div>

                      <div
                        v-else-if="header.type === ROW_TYPES.HTML"
                        :class="header.rowClassList"
                        v-html="elem[header.identifier]"
                      />

                      <div
                        v-else-if="header.type === ROW_TYPES.TEXT_WITH_LINKS"
                        :class="header.rowClassList"
                      >
                        <div>{{ elem[header.identifier] }}</div>

                        <div
                          v-for="(link, index) in header.links"
                          :key="`links-${header.identifier}-${index}`"
                          class="text-xs inline-block"
                        >
                          <span v-if="index !== 0">&nbsp;|&nbsp;</span>

                          <a
                            :href="link.href"
                            class="text-blue-600 hover:text-blue-800"
                          >
                            {{ link.label }}
                          </a>
                        </div>
                      </div>
                    </td>

                    <slot name="lastCell" />
                  </tr>
                </transition-group>
                <tr v-if="_data.length <= 0">
                  <slot name="emptyState" />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.drag-list-move,
.drag-list-enter-active,
.drag-list-leave-active {
  transition: transform 1s;
}
.drag-list-enter,
.drag-list-leave-active {
  opacity: 0;
  transform: translateX(30px);
}
.drag-list-leave-active {
  position: absolute;
}
</style>
