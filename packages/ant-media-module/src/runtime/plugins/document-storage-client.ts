import { defineNuxtPlugin } from '#app';
import { joinURL } from 'ufo';

type UploadResponse = {
  fileName: string;
  title: string;
  fileType: string;
}[];

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      documentStorageClient: {
        getUrlFromProvider: function (provider: string): string {
          const providers: Record<string, { serverUrl: string }> =
            useRuntimeConfig().antMedia.providers;

          if (providers[provider] === undefined) {
            throw new Error(
              `Provider ${provider} does not exists in configuration.`
            );
          }

          return providers[provider].serverUrl;
        },
        // TODO:: unify antt value
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
            joinURL(serverUrl, encodeURI(directory)),
            {
              method: 'POST',
              headers: {
                // TODO:: send it from cookie
                authorization: this.getTokenFromCookie(),
              },
              body: formData,
            }
          );

          return data.value as UploadResponse;
        },
      },
    },
  };
});
