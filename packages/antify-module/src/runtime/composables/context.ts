import { CONTEXT_HEADER_KEY } from '@antify/context';

export const useContextHeader = (context: string) => ({
  [CONTEXT_HEADER_KEY]: context,
});
