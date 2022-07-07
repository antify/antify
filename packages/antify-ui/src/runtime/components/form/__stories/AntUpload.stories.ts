import { faCamera } from '@fortawesome/free-solid-svg-icons';
import AntUpload from '../AntUpload.vue';
import { ref } from 'vue';

export default {
  title: 'Components/Forms/Ant Upload',
  component: AntUpload,
};

const Template = (args: any) => ({
  components: { AntUpload },
  setup() {
    return { args };
  },
  template: `<div class="m-2"><AntUpload v-bind="args"/></div>`,
});

export const Simple = Template.bind({});
// @ts-ignore
Simple.args = {
  label: 'Simple Upload',
};

export const ImageUpload = (args: any) => ({
  components: { AntUpload },
  setup() {
    const image = ref({});

    return {
      label: 'Image Upload',
      acceptType: 'image/*',
      icon: faCamera,
      value: image,
    };
  },
  template: `
  <div class="m-2">
    <AntUpload 
      v-model:value="value"
      accept-type="acceptType"
      :icon="icon"
      :label="label"
      :show-preview="true"
    />
  </div>`,
});
