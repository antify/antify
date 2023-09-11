import {
  emailRule,
  notBlankRule,
  Types,
  isTypeOfRule,
  useValidator,
} from '@antify/validate';

export type Response = {
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
export type Input = {
  email: string;
  password: string;
  token?: string;
};
export const validator = useValidator({
  email: [
    (val: unknown) => isTypeOfRule(val, Types.STRING),
    notBlankRule,
    emailRule,
  ],
  password: [(val: unknown) => isTypeOfRule(val, Types.STRING), notBlankRule],
});
