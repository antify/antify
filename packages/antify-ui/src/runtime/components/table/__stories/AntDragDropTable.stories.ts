import AntDragDropTable from '../AntDragDropTable.vue';
import { TableHeader, ROW_TYPES } from '../../../types/TableHeader.type';

import { ref } from 'vue';
export default {
  title: 'Components/Table/Ant DragDrop Table',
  component: AntDragDropTable,
};

export const Simple = (args: any) => ({
  components: { AntDragDropTable },
  setup() {
    const testData = ref([
      {
        id: 1,
        duration: 10,
        timeFrom: '16:00',
        timeTo: '16:10',
        theme: 'Warm-Up',
        order: 10,
      },
      {
        id: 2,
        duration: 45,
        timeFrom: '16:10',
        timeTo: '16:55',
        theme: 'Hot-Seat',
        order: 20,
      },
      {
        id: 3,
        duration: 5,
        timeFrom: '16:55',
        timeTo: '17:00',
        theme: 'Pause',
        order: 30,
      },
      {
        id: 4,
        duration: 45,
        timeFrom: '17:00',
        timeTo: '17:45',
        theme: 'Hot-Seat',
        order: 40,
      },
      {
        id: 5,
        duration: 10,
        timeFrom: '17:45',
        timeTo: '17:55',
        theme: 'Feedback',
        order: 50,
      },
      {
        id: 6,
        duration: 5,
        timeFrom: '17:55',
        timeTo: '18:00',
        theme: 'New appointment and finish',
        order: 60,
      },
    ]);

    const simpleHeaders = ref<TableHeader[]>([
      {
        identifier: 'duration',
        title: 'Dauer',
        type: ROW_TYPES.TEXT,
      },
      {
        identifier: 'timeFrom',
        title: 'Uhrzeit',
        type: ROW_TYPES.TEXT,
      },
      {
        identifier: 'timeTo',
        title: 'Uhrzeit',
        headerClassList: 'sr-only',
        type: ROW_TYPES.TEXT,
      },
      {
        identifier: 'theme',
        title: 'Thema',
        type: ROW_TYPES.TEXT,
      },
    ]);

    return { testData, simpleHeaders };
  },
  template: `<AntDragDropTable
    :headers="simpleHeaders"
    v-model:data="testData"
   />`,
});
