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
}
