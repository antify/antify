import { RouteLocationRaw } from 'vue-router';

export type NavItem = {
  icon?: Object;
  label: String;
  route?: RouteLocationRaw;
  active: Boolean;
  subItems?: NavItem[];
};
