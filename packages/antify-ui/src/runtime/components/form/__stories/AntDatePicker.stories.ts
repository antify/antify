import AntDatePicker from '../AntDatePicker.vue';
import { ref } from 'vue';

export default {
  title: 'Components/Forms/Ant Date Picker',
  component: AntDatePicker,
};

export const Simple = (args: any) => ({
  components: { AntDatePicker },
  setup() {
    const value = ref('');

    return { value };
  },
  template: `
  <div class="m-2">
    <AntDatePicker label="Datepicker" v-model:value="value"/>
  </div>`,
});
