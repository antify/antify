import AntNavItem from '../AntNavItem.vue';
import { faHouse, faRecycle } from '@fortawesome/free-solid-svg-icons';
export default {
  title: 'Components/Navigation/Ant Nav Item',
  component: AntNavItem,
};

const Template = (args: any) => ({
  components: { AntNavItem },
  setup() {
    return { args };
  },
  template: `<AntNavItem v-bind="args"/>`,
});

export const Simple = Template.bind({});
// @ts-ignore
Simple.args = {
  navItem: {
    label: 'Dashboard',
    route: '#',
  },
};

export const Active = Template.bind({});
// @ts-ignore
Active.args = {
  navItem: {
    label: 'Dashboard',
    route: '#',
    active: true,
  },
};

export const WithIcon = Template.bind({});
// @ts-ignore
WithIcon.args = {
  navItem: {
    label: 'Dashboard',
    route: '#',
    active: true,
    icon: faHouse,
  },
};

export const WithSubMenu = Template.bind({});
// @ts-ignore
WithSubMenu.args = {
  navItem: {
    label: 'Templates',
    subItems: [
      {
        label: 'Agenda',
        route: '#',
        active: false,
      },
      {
        label: 'Meeting fields',
        route: '#',
        active: false,
      },
      {
        label: 'OKR',
        route: '#',
        active: false,
      },
    ],
    icon: faRecycle,
    active: false,
  },
};
