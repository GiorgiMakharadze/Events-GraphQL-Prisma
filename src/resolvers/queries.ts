import { prisma } from '_app/prisma/client';

const Query = {
  users: async () => prisma.user.findMany(),
  user: async (_root, { id }) => prisma.user.findUnique({ where: { id } }),
  events: async () => prisma.event.findMany(),
  event: async (_root, { id }) => prisma.event.findUnique({ where: { id } }),
};

export default Query;
