import {
  useValidator,
  isTypeOfRule,
  Types,
  notBlankRule,
} from '@antify/validate';

export const validator = useValidator({
  content: [(val: unknown) => isTypeOfRule(val, Types.STRING), notBlankRule],
  isGlobalVisible: [(val: unknown) => isTypeOfRule(val, Types.BOOLEAN)]
});
