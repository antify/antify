import { appInstallPostValidator, AppInstallPostInput, AppInstallPostResponse } from '~~/glue/api/app/install.post';
import { handleCreateToken, hashPassword } from '~~/server/utils/tokenUtil';
import { apiAppInstallService } from './install.service';
import prisma from "~~/server/datasources/core/client";

export default defineEventHandler<AppInstallPostResponse>(async (event) => {
    const requireInstall = await apiAppInstallService.requireInstall();

    if (!requireInstall) {
        return {
            installNotPossible: {
                errors: ['Install process is already done']
            }
        }
    }

    const requestData = await useBody<AppInstallPostInput>(event);

    appInstallPostValidator.validate(requestData);

    if (appInstallPostValidator.hasErrors()) {
        return {
            badRequest: {
                errors: appInstallPostValidator.getErrors()
            }
        }
    }

    const tenant = await prisma.tenant.create({
        data: {
            name: "Erster Mandant"
        }
    });
    const role = await prisma.role.create({
        data: {
            name: 'Administrator',
            isAdmin: true
        }
    });
    const password = await hashPassword(requestData.password);
    const user = await prisma.user.create({
        data: {
            email: requestData.email,
            name: requestData.name,
            isSuperAdmin: true,
            password,
            tenantAccesses: {
                create: {
                    tenantId: tenant.id,
                    roleId: role.id
                }
            }
        }
    });

    const token = await handleCreateToken(event, {
        email: user.email,
        password: user.password
    });

    if (!token) {
        throw new Error('Unable to create a token for initial user');
    }

    return {
        default: {
            token
        }
    }
});
