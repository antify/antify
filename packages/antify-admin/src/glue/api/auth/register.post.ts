import { useValidator } from '../../../../../ant-validate/src/useValidator';
import { notBlankRule } from '../../../../../ant-validate/src/rules/notBlank.rule';
import { emailRule } from '../../../../../ant-validate/src/rules/email.rule';
import {
  isTypeOfRule,
  Types,
} from '../../../../../ant-validate/src/rules/isTypeOf.rule';

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
};

export type Input = {
  email: string;
  password: string;
  token: string;
};

export const validator = useValidator({
  email: [
    (val: unknown) => isTypeOfRule(val, Types.STRING),
    notBlankRule,
    emailRule,
  ],
  password: [(val: unknown) => isTypeOfRule(val, Types.STRING), notBlankRule],
  repeatPassword: [
    (val: unknown) => isTypeOfRule(val, Types.STRING),
    notBlankRule,
  ],
});
