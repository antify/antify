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
