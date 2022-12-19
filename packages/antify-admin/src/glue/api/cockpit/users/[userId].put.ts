import {
  useValidator,
  isTypeOfRule,
  Types,
  notBlankRule,
  emailRule,
} from '@antify/validate';

export type Input = {
  email: string;
  name: string;
};

export type Response = {
  default?: {
    id: string;
    email: string;
    name: string;
    isAdmin: boolean;
    isBanned: boolean;
  };
  badRequest?: {
    errors: string[];
  };
};

export type User = {
  id: string;
  email: string;
  name: string;
};

export const validator = useValidator({
  name: [(val: unknown) => isTypeOfRule(val, Types.STRING), notBlankRule],
  email: [
    (val: unknown) => isTypeOfRule(val, Types.STRING),
    notBlankRule,
    emailRule,
  ],
});
