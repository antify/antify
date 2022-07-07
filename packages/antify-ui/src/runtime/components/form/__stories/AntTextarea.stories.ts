import AntTextarea from '../AntTextarea.vue';

export default {
  title: 'Components/Forms/Ant Text area',
  component: AntTextarea,
};

const Template = (args: any) => ({
  components: { AntTextarea },
  setup() {
    return { args };
  },
  template: `<AntTextarea v-bind="args" />`,
});

export const Simple = Template.bind({});
// @ts-ignore
Simple.args = {
  id: 'textarea-12341887',
  label: 'Textarea',
};
