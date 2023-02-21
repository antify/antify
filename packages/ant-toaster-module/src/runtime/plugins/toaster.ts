import { Toast, ToastType } from '../types';

export const useToastState = () => useState<Toast[]>('toasts', () => []);

export default defineNuxtPlugin(() => {
  const messageShowTime = useRuntimeConfig().public.antToaster.messageShowTime;

  return {
    provide: {
      toaster: {
        getToasts() {
          const toasts = useToastState();

          return toasts.value;
        },
        toast(toast: Toast) {
          const toasts = useToastState();

          toasts.value.push(toast);

          setTimeout(() => {
            toasts.value.shift();
          }, messageShowTime);
        },
        toastSuccess(message: string) {
          this.toast({ text: message, type: ToastType.success });
        },
        toastError(message: string) {
          this.toast({ text: message, type: ToastType.error });
        },
        toastWarning(message: string) {
          this.toast({ text: message, type: ToastType.warning });
        },
        toastDeleted() {
          // TODO:: translate
          this.toastSuccess('Deleted');
        },
        toastCreated() {
          // TODO:: translate
          this.toastSuccess('Saved');
        },
        toastUpdated() {
          // TODO:: translate
          this.toastSuccess('Saved');
        },
      },
    },
  };
});
