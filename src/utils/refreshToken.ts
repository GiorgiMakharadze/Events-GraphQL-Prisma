import { V4 as paseto } from 'paseto';
import { prisma } from '_app/prisma/client';
import { privateKeyPEM } from '_app/utils/keyManager';

const generateRefreshToken = async (user) => {
  const refreshTokenPayload = { id: user.id };
  const refreshToken = await paseto.sign(refreshTokenPayload, privateKeyPEM);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return refreshToken;
};

export default generateRefreshToken;
