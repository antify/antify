import { getDatabaseClientFromRequest } from '../database';

export const useAntify = () => ({
  getDatabaseClient: getDatabaseClientFromRequest,
});
