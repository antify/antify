import {
  useValidator,
  isTypeOfRule,
  Types,
  notBlankRule,
  emailRule,
} from '@antify/validate';

export type AppInstallPostResponse = {
  default?: {
    token: string;
  };
  badRequest?: {
    errors: string[];
  };
  installNotPossible?: {
    errors: string[];
  };
};
export type AppInstallPostInput = {
  name: string;
  email: string;
  password: string;
};
export const appInstallPostValidator = useValidator({
  name: [(val: unknown) => isTypeOfRule(val, Types.STRING), notBlankRule],
  email: [
    (val: unknown) => isTypeOfRule(val, Types.STRING),
    notBlankRule,
    emailRule,
  ],
  password: [(val: unknown) => isTypeOfRule(val, Types.STRING), notBlankRule],
});
