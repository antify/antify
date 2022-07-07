import prisma from "~~/server/datasources/db/client";

export const apiAppInstallService = {
    requireInstall: async () => {
        const tenant = await prisma.tenant.findFirst();

        return !!!tenant;
    }
}