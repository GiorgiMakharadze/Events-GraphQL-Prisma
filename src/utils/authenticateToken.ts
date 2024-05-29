import { V4 as paseto } from 'paseto';
import { prisma } from '_app/prisma/client';
import { publicKeyPEM } from '_app/utils';
import { unauthorizedError } from '_app/errors';

const authenticateToken = async (token: string) => {
  if (!token) {
    throw unauthorizedError('No token provided');
  }

  const payload = (await paseto.verify(token, publicKeyPEM)) as any;

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
  });
  if (!user) {
    throw unauthorizedError('Invalid token: user not found');
  }

  return user;
};

export default authenticateToken;
