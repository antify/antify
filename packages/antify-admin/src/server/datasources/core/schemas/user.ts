import { Media } from './media';

// TODO:: extend from database user
export interface User {
  email: string;
  password: string | null;
  name: string;
  isSuperAdmin: boolean;
  isBanned: boolean;
  profilePicture: Media | null;
  // tenantAccesses: UserTenantAccess[];
  // TODO:: Rly a date? Its a timestamp right?
  createdAt: Date;
  // TODO:: Rly a date? Its a timestamp right?
  updatedAt: Date;
}

// export const userSchemaDefinition: SchemaDefinition<User> = {
//   email: {
//     type: string,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: string,
//     required: false,
//   },
//   name: {
//     type: string,
//     required: true,
//   },
//   isSuperAdmin: {
//     type: boolean,
//     required: true,
//     default: false,
//   },
//   isBanned: {
//     type: string,
//     required: true,
//     default: false,
//   },
//   // tenantAccesses: {
//   //   type: tenantAccess,
//   //   required: true,
//   // },
//   // profilePicture: {
//   //   type: Media,
//   //   required: true,
//   // },
//   // profilePictureId: {
//   //   type: string,
//   //   required: true,
//   // },
// };
