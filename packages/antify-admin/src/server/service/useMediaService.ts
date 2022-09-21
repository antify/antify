import path from 'node:path';
import fs from 'node:fs';

type Media = {
  fileName: string;
};

export const useMediaService = (media: Media) => {
  return {
    getMediaUrl(tenantId: string) {
      // TODO:: dynamic url
      return `http://localhost:3000/api/backoffice/${tenantId}/media/file/${media?.fileName}`;
    },
    getProfileUrl() {
      return `http://localhost:3000/api/backoffice/034747e1-8913-482f-9ecc-0154195ba783/profile/file/${media?.fileName}`;
    },
    getLogoUrl(tenantId: string) {
      return `http://localhost:3000/api/tenants/file/${tenantId}/${media?.fileName}`;
    },
    getAbsoluteUploadPath() {
      return useMediaStorage().getAbsoluteUploadPath(media?.fileName);
    },
    getAbsoluteUploadDir() {
      return useMediaStorage().getAbsoluteUploadDir();
    },
    createReadStream() {
      return fs.createReadStream(this.getAbsoluteUploadPath());
    },
    async deleteFile() {
      return new Promise<void>((resolve, reject) => {
        fs.unlink(this.getAbsoluteUploadPath(), (error) => {
          if (error) {
            reject(error);
          }

          resolve();
        });
      });
    },
  };
};

export const useMediaStorage = () => {
  const { mediaUploadDir } = useRuntimeConfig();

  return {
    getAbsoluteUploadPath(fileName: string) {
      return path.join(this.getAbsoluteUploadDir(), fileName);
    },
    getAbsoluteUploadDir() {
      return path.join(path.resolve(), mediaUploadDir);
    },
  };
};
