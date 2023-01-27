import { defineNuxtPlugin } from '#app';

type UploadResponse = {
  fileName: string;
  title: string;
  fileType: string;
}[];

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      documentStorageClient: () => ({
        getUrlFromProvider: function (provider: string): string {
          const { antDocumentStorage } = useRuntimeConfig();

          if (antDocumentStorage.provider[provider] === undefined) {
            throw new Error(
              `Provider ${provider} does not exists in configuration.`
            );
          }

          return antDocumentStorage.provider[provider].serverUrl;
        },
        getTokenFromCookie: (): string => useCookie('antt').value || '',
        // TODO:: emit and set type
        upload: async function (
          provider: string,
          directory: string,
          event
        ): Promise<UploadResponse> {
          const serverUrl = this.getUrlFromProvider(provider);
          let formData = new FormData();

          for (let i = 0; i < event.target.files.length; i++) {
            formData.append(`file-${i}`, event.target.files[i]);
          }

          // TODO:: handle errors
          const { data } = await useFetch(
            `${serverUrl}/upload?dir=${encodeURI(directory)}`,
            {
              method: 'POST',
              headers: {
                authorization: this.getTokenFromCookie(),
              },
              body: formData,
            }
          );

          return data.value as UploadResponse;
        },
      }),
    },
  };
});
