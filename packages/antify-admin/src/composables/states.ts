import { Tenant } from '~~/glue/api/global/tenants.get';
import { TenantDefault } from '~~/glue/api/tenants/[tenantDetailId].get';
import { User } from '~~/glue/api/global/me.get';

export const useTenantState = () => useState<Tenant[]>('tenants', () => []);
export const useCurrentTenantState = () =>
  useState<TenantDefault>('tenant', () => ({}));
export const useMeState = () => useState<User | null>('me', () => null);

export enum ToastType {
  error = 'error',
  success = 'success',
  warning = 'warning',
}
export type Toast = {
  id?: string;
  text: string;
  type: ToastType;
};

export const useToastState = () => useState<Toast[]>('toasts', () => []);
export const useUserDetailState = () => useState('userDetail', () => null);
