import { V4 as paseto } from 'paseto';
import { prisma } from '_app/prisma/client';
import { publicKeyPEM } from '_app/utils';
import { UnauthenticatedError } from '_rest/errors';

const verifyAccessToken = async (accessToken: string) => {
  const payload = await paseto.verify(accessToken, publicKeyPEM);
  if (!payload) {
    throw new UnauthenticatedError('Invalid or expired access token');
  }
  return payload;
};

const verifyRefreshToken = async (refreshToken: string) => {
  const payload = await paseto.verify(refreshToken, publicKeyPEM);
  if (!payload || typeof payload.id !== 'string') {
    throw new UnauthenticatedError('Invalid or expired refresh token');
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id, refreshToken },
  });

  if (!user) {
    throw new UnauthenticatedError('Invalid or expired refresh token');
  }
  return payload;
};

export { verifyAccessToken, verifyRefreshToken };
