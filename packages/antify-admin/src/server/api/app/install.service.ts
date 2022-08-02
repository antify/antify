import prisma from "~~/server/datasources/core/client";

export const apiAppInstallService = {
    requireInstall: async () => {
        const tenant = await prisma.tenant.findFirst();

        return !!!tenant;
    }
}