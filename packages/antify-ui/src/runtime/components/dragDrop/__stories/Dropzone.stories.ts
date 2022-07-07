import AntDropzone from '../AntDropzone.vue';

export default {
  title: 'Components/DragDrop/Dropzone',
  component: AntDropzone,
};

const Template = (args: any) => ({
  components: { AntDropzone },
  setup() {
    return {
      args,
    };
  },
  template: `<div class="p-4"><AntDropzone v-bind="args"/></div>`,
});

export const Simple = Template.bind({});
// @ts-ignore
Simple.args = {};
