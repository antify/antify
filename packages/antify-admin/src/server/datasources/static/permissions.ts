export enum PermissionId {
  CAN_CREATE_USER = 'CAN_CREATE_USER',
  CAN_READ_USER = 'CAN_READ_USER',
  CAN_UPDATE_USER = 'CAN_UPDATE_USER',
  CAN_DELETE_USER = 'CAN_DELETE_USER',
  CAN_BAN_USER = 'CAN_BAN_USER',
  CAN_UNBAN_USER = 'CAN_UNBAN_USER',
  CAN_UPDATE_SELF = 'CAN_UPDATE_SELF',
  CAN_UPLOAD_PROFILE_PICTURE = 'CAN_UPLOAD_PROFILE_PICTURE',
  CAN_REMOVE_PROFILE_PICTURE = 'CAN_REMOVE_PROFILE_PICTURE',

  CAN_UPDATE_ROLE = 'CAN_UPDATE_ROLE',
  CAN_DELETE_ROLE = 'CAN_DELETE_ROLE',
  CAN_CREATE_ROLE = 'CAN_CREATE_ROLE',

  CAN_READ_MAIL_TEMPLATES = 'CAN_READ_MAIL_TEMPLATES',
  CAN_EDIT_MAIL_TEMPLATES = 'CAN_EDIT_MAIL_TEMPLATES',

  CAN_READ_MEDIA = 'CAN_READ_MEDIA',
  CAN_CREATE_MEDIA = 'CAN_CREATE_MEDIA',
  CAN_EDIT_MEDIA = 'CAN_EDIT_MEDIA',
  CAN_DELETE_MEDIA = 'CAN_DELETE_MEDIA',

  CAN_READ_TENANT = 'CAN_READ_TENANT'
}

export const permissions = [
  {
    id: PermissionId.CAN_CREATE_USER,
    name: 'Kann Benutzer erstellen',
  },
  {
    id: PermissionId.CAN_READ_USER,
    name: 'Kann Benutzer lesen',
  },
  {
    id: PermissionId.CAN_UPDATE_USER,
    name: 'Kann Benutzer bearbeiten',
  },
  {
    id: PermissionId.CAN_DELETE_USER,
    name: 'Kann Benutzer löschen',
  },
  {
    id: PermissionId.CAN_BAN_USER,
    name: 'Kann Benutzer Sperren',
  },
  {
    id: PermissionId.CAN_UNBAN_USER,
    name: 'Kann Sperre aufheben',
  },
  {
    id: PermissionId.CAN_UPDATE_SELF,
    name: 'Kann sein Account bearbeiten',
  },
  {
    id: PermissionId.CAN_UPLOAD_PROFILE_PICTURE,
    name: 'Kann Profil Bild hochladen',
  },
  {
    id: PermissionId.CAN_REMOVE_PROFILE_PICTURE,
    name: 'Kann Profil Bild entfernen',
  },
  {
    id: PermissionId.CAN_READ_MAIL_TEMPLATES,
    name: 'Kann E-Mail Templates lesen',
  },
  {
    id: PermissionId.CAN_READ_MEDIA,
    name: 'Kann Medien lesen',
  },
  {
    id: PermissionId.CAN_CREATE_MEDIA,
    name: 'Kann Dateien hochladen',
  },
  {
    id: PermissionId.CAN_EDIT_MEDIA,
    name: 'Kann Dateien bearbeiten',
  },
  {
    id: PermissionId.CAN_DELETE_MEDIA,
    name: 'Kann Dateien löschen',
  },
];
