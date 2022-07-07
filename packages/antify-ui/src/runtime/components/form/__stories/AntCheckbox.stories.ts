import AntCheckbox from '../AntCheckbox.vue';

export default {
  title: 'Components/Forms/Ant Checkbox',
  component: AntCheckbox,
};

const Template = (args: any) => ({
  components: { AntCheckbox },
  setup() {
    return { args };
  },
  template: `<div class="m-2"><AntCheckbox v-bind="args"/></div>`,
});

export const Simple = Template.bind({});
// @ts-ignore
Simple.args = {
  label: 'Checkbox',
  value: '',
};
