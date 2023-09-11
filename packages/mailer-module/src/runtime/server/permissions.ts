import { Permission } from '@antify/ant-guard';

export enum PermissionId {
  CAN_READ_MAIL_TEMPLATES = 'CAN_READ_MAIL_TEMPLATES',
  CAN_EDIT_MAIL_TEMPLATES = 'CAN_EDIT_MAIL_TEMPLATES',
}

export const permissions: Permission[] = [
  {
    id: PermissionId.CAN_READ_MAIL_TEMPLATES,
    name: 'Can read mail templates'
  },
  {
    id: PermissionId.CAN_EDIT_MAIL_TEMPLATES,
    name: 'Can edit mail templates'
  },
];
