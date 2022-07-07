import AntLayout from '../AntLayout.vue';
import AntContent from '../AntContent.vue';
import AntProfilePicture from '../../images/AntProfilePicture.vue';
import AntLogo from '../../images/AntLogo.vue';
import {
  faHouse,
  faRecycle,
  faTrophy,
  faUser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { NavItem } from '../../../types/NavItem.type';

export default {
  title: 'Components/Layout/Ant Layout',
  component: AntLayout,
};

const Template = (args: any) => ({
  components: { AntLayout, AntProfilePicture, AntLogo, AntContent },
  setup() {
    return { args };
  },
  template: `
	<AntLayout v-bind="args">
		<template #logo>
      <AntLogo 
        logo-url="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
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

		<template #default>
      <AntContent>
        <template #head>
          <h1 class="text-2xl px-4 py-3 font-semibold text-gray-900">Dashboard</h1>
        </template>

        <template #body>
          <div
            class="mx-4 my-3 border-4 border-dashed border-gray-200 rounded-lg h-96"
          />
        </template>
      </AntContent>
		</template>
	</AntLayout>
	`,
});

const navItems: NavItem[] = [
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

export const Primary = Template.bind({});
// @ts-ignore
Primary.args = {
  navItems,
  userName: 'Horst Mustermann',
  profileHref: '/profile',
};
