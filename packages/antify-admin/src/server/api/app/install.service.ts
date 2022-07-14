import prisma from "~~/server/datasources/auth/client";

export const apiAppInstallService = {
    requireInstall: async () => {
        const tenant = await prisma.tenant.findFirst();

        return !!!tenant;
    }
}