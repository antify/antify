import AntNavProfile from '../AntNavProfile.vue';
import AntProfilePicture from '../../images/AntProfilePicture.vue';

export default {
  title: 'Components/Navigation/Ant Nav profile',
  component: AntNavProfile,
};

const Template = (args: any) => ({
  components: { AntNavProfile, AntProfilePicture },
  setup() {
    return {
      args,
    };
  },
  template: `
  <AntNavProfile v-bind="args">
    <template #profilePicture>
      <AntProfilePicture
        image-url="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        alt=""
      />
    </template>

    <template #viewProfile>view profile</template>
  </AntNavProfile>`,
});

export const Simple = Template.bind({});
// @ts-ignore
Simple.args = {
  to: '#',
  userName: 'Courtney Henry',
};
