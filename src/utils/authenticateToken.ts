import { V4 as paseto } from 'paseto';
import { prisma } from '_app/prisma/client';
import { publicKeyPEM } from '_rest/utils';
import { unauthorizedError } from '_app/errors';

const authenticateToken = async (token: string) => {
  if (!token) {
    throw unauthorizedError('No token provided');
  }
  console.log('Verifying token:', token);

  const payload = (await paseto.verify(token, publicKeyPEM)) as { id: string };

  console.log('Token payload:', payload);

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
  });

  if (!user) {
    throw unauthorizedError('Invalid token: user not found');
  }

  console.log('Authenticated user:', user.id);

  return user;
};

export default authenticateToken;
