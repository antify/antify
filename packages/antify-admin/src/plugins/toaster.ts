import { Toast, ToastType } from "../composables/states";

const messageShowTime = 4000;

export default defineNuxtPlugin(nuxtApp => {
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
          this.toast({text: message, type: ToastType.success});
        },
        toastError(message: string) {
          this.toast({text: message, type: ToastType.error});
        },
        toastWarning(message: string) {
          this.toast({text: message, type: ToastType.warning});
        },
        toastDeleted() {
          this.toastSuccess('Gelöscht');
        },
        toastCreated() {
          this.toastSuccess('Gespeichert');
        },
        toastUpdated() {
          this.toastSuccess('Gespeichert');
        },
      }
    }
  }
});
