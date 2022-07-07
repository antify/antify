import AntProfilePicture from '../AntProfilePicture.vue';

export default {
  title: 'Components/Images/Ant Profile Picture',
  component: AntProfilePicture,
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
};

const Template = (args: any) => ({
  components: { AntProfilePicture },
  setup() {
    return { args };
  },
  template: '<AntProfilePicture v-bind="args" />',
});

export const Primary = Template.bind({});
// @ts-ignore
Primary.args = {
  imageUrl:
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  alt: 'Image',
};

export const Small = Template.bind({});
// @ts-ignore
Small.args = {
  imageUrl:
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  alt: 'Image',
  size: 'small',
};
