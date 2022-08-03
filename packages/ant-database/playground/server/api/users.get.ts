import prisma from '~~/server/datasources/core/client';

export default defineEventHandler(async (event) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  return users;
});
