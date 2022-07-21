import path from 'node:path';
import fs from 'node:fs';

type Media = {
    fileName: string
}

export const useMediaService = (media: Media) => {
    return {
        getUrl() {
            // TODO:: dynamic url
            return `http://localhost:3000/api/admin/034747e1-8913-482f-9ecc-0154195ba783/media/file/${media.fileName}`
        },
        getAbsoluteUploadPath() {
            return useMediaStorage().getAbsoluteUploadPath(media.fileName);
        },
        getAbsoluteUploadDir() {
            return useMediaStorage().getAbsoluteUploadDir();
        },
        createReadStream() {
            return fs.createReadStream(this.getAbsoluteUploadPath());
        },
        async deleteFile() {
            return new Promise((reject) => {
                fs.unlink(this.getAbsoluteUploadPath(), (error) => {
                    if (error) {
                        reject(error);
                    }
                });
            });
        }
    }
}

export const useMediaStorage = () => {
    const { mediaUploadDir } = useRuntimeConfig();

    return {
        getAbsoluteUploadPath(fileName: string) {
            return path.join(this.getAbsoluteUploadDir(), fileName);
        },
        getAbsoluteUploadDir() {
            return path.join(path.resolve(), mediaUploadDir);
        }
    }
}