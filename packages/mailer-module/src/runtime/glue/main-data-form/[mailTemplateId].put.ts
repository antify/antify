import {
  useValidator,
  isTypeOfRule,
  Types,
  notBlankRule,
} from '@antify/validate';

export type Input = {
  title: string;
  content: string;
};
export const validator = useValidator({
  title: [(val: unknown) => isTypeOfRule(val, Types.STRING), notBlankRule],
  content: [(val: unknown) => isTypeOfRule(val, Types.STRING)],
});
