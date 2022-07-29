import {
  emailRule,
  notBlankRule,
  Types,
  isTypeOfRule,
  useValidator,
} from '@antify/ant-validate';

export type AuthLoginPostResponse = {
  default?: {
    token: string;
  };
  badRequest?: {
    errors: string[];
  };
  invalidCredentials?: {
    errors: string[];
  };
  banned?: {
    errors: string[];
  };
};
export type AuthLoginPostInput = {
  email: string;
  password: string;
  token?: string;
};
export const authLoginPostValidator = useValidator({
  email: [
    (val: unknown) => isTypeOfRule(val, Types.STRING),
    notBlankRule,
    emailRule,
  ],
  password: [(val: unknown) => isTypeOfRule(val, Types.STRING), notBlankRule],
});
