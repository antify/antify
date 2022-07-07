import AntPasswordWidget from '../AntPasswordWidget.vue';

export default {
  title: 'Components/Forms/Password/Ant Password Widget',
  component: AntPasswordWidget,
};

const Template = (args: any) => ({
  components: { AntPasswordWidget },
  setup() {
    return { args };
  },
  template: '<AntPasswordWidget v-bind="args"/>',
});

export const Primary = Template.bind({});
// @ts-ignore
Primary.args = {
  id: 'input-id-123456789',
  value: '',
  label: 'Password',
  repeatLabel: 'Repeat password',
  placeholder: 'Password placeholder',
  repeatPlaceholder: 'Repeat password placeholder',
  showPassword: true,
};
