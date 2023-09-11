export interface User {
  email: string;
  password: string | null;
  isSuperAdmin: boolean;
  isBanned: boolean;
  invites: {
    invitedAt: number;
    code: string;
    context: string;
    tenantId: string | null;
  }[];
  forgotPassword: {
    sendAt: Date;
    code: string;
  } | null;
  // TODO:: Rly a date? Its a timestamp right?
  createdAt: Date;
  // TODO:: Rly a date? Its a timestamp right?
  updatedAt: Date;
}
