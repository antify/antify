import prisma from '~~/server/datasources/core/client';

/**
 * Checks if a role has a connection in userTenantAccess.
 */
export async function checkUserTenantAccess(roleId: string) {
  return await prisma.userTenantAccess.findMany({
    select: {
      tenantId: true,
      userId: true,
      roleId: true,
    },
    where: {
      roleId,
    },
  });
}
