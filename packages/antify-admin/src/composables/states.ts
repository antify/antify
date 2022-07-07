import { Tenant } from "~~/glue/api/global/tenants.get";
import { User } from "~~/glue/api/global/me.get";

export const useTenantState = () => useState<Tenant[]>('tenants', () => []);
export const useMeState = () => useState<User>('me', () => null);

export enum ToastType {
    error = 'error',
    success = 'success',
    warning = 'warning'
}
export type Toast = {
    id?: string,
    text: string,
    type: ToastType
}

export const useToastState = () => useState<Toast[]>('toasts', () => []);
