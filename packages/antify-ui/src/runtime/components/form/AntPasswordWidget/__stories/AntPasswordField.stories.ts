import AntPasswordField from '../AntPasswordField.vue';

export default {
  title: 'Components/Forms/Password/Ant Password Field',
  component: AntPasswordField,
};

const Template = (args: any) => ({
  components: { AntPasswordField },
  setup() {
    return { args };
  },
  template: `<div class="m-2"><AntPasswordField v-bind="args"/></div>`,
});

export const Simple = Template.bind({});
// @ts-ignore
Simple.args = {};
