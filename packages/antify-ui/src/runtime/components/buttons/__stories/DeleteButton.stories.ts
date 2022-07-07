import DeleteButton from '../DeleteButton.vue';

export default {
  title: 'Components/Buttons/Delete Button',
  component: DeleteButton,
  argTypes: {
    backgroundColor: { control: 'color' },
    onClick: {},
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
};

const Template = (args: any) => ({
  components: { DeleteButton },
  setup() {
    return { args };
  },
  template: '<DeleteButton v-bind="args" />',
});

export const Primary = Template.bind({});
// @ts-ignore
Primary.args = {
  id: 'delete-button-123490',
  label: 'Delete',
};
