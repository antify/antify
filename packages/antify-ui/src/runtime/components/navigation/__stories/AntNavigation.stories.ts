import AntNavigation from '../AntNavigation.vue';
import AntProfilePicture from '../../images/AntProfilePicture.vue';
import { NavItem } from '../../../types/NavItem.type';
import {
  faHouse,
  faRecycle,
  faTrophy,
  faUser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';

export default {
  title: 'Components/Navigation/Ant Navigation',
  component: AntNavigation,
};
const Template = (args: any) => ({
  components: { AntNavigation, AntProfilePicture },
  setup() {
    return { args };
  },
  template: `
  <AntNavigation v-bind="args">
    <template #logo>
			<img
				class="h-8 w-auto"
				src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
				alt="Workflow"
			/>
		</template>
		<template #profilePicture>
      <AntProfilePicture
        image-url="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        alt=""
      />
		</template>
		<template #viewProfile> open profile </template>
  </AntNavigation>`,
});

const navItemsSimple: NavItem[] = [
  {
    label: 'Dashboard',
    active: true,
  },
  {
    label: 'Group',
    active: false,
  },
];

const navItemsWithIcons: NavItem[] = [
  {
    label: 'Dashboard',
    route: '#',
    icon: faHouse,
    active: true,
  },
  {
    label: 'User',
    route: '#',
    icon: faUser,
    active: false,
  },
];

const navItemsWithIconsAndSubmenu: NavItem[] = [
  {
    label: 'Dashboard',
    route: '#',
    icon: faHouse,
    active: true,
  },
  {
    label: 'User',
    route: '#',
    icon: faUser,
    active: false,
  },
  {
    label: 'Group',
    route: '#',
    icon: faUsers,
    active: false,
  },
  {
    label: 'Goals',
    route: '#',
    icon: faTrophy,
    active: false,
  },
  {
    label: 'Integrations',
    route: '#',
    active: false,
  },
  {
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
  {
    label: 'Logout',
    active: false,
  },
];

export const Simple = Template.bind({});
// @ts-ignore
Simple.args = {
  navItems: navItemsSimple,
  profileHref: '/profile',
  userName: 'Horst',
};

export const WithIcons = Template.bind({});
// @ts-ignore
WithIcons.args = {
  navItems: navItemsWithIcons,
  profileHref: '/profile',
  userName: 'Horst',
};

export const WithIconsAndSubMenu = Template.bind({});
// @ts-ignore
WithIconsAndSubMenu.args = {
  navItems: navItemsWithIconsAndSubmenu,
  profileHref: '/profile',
  userName: 'Horst',
};

export const Empty = Template.bind({});
// @ts-ignore
Empty.args = {
  navItems: [],
  profileHref: '/profile',
  userName: 'Horst',
};
