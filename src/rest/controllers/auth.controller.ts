import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { V4 as paseto } from 'paseto';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '_app/prisma/client';
import { NotFoundError, UnauthenticatedError, UnauthorizedError } from '_app/rest/errors';
import generateRefreshToken from '_app/utils/refreshToken';
import setCookies from '_app/utils/setCookies';
import { privateKeyPEM } from '_app/utils';
import omitPrivate from '_app/utils/omitPrivate';

export const logIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Email and password are required' });
  }

  console.log('Email:', email);
  console.log('Password:', password);

  const user = await prisma.user.findUnique({
    where: { email },
    include: { events: true },
  });

  if (!user) {
    throw new NotFoundError('User does not exist');
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new UnauthenticatedError('Invalid email or password');
  }

  const tokenPayload = { id: user.id };
  const token = await paseto.sign(tokenPayload, privateKeyPEM);
  const refreshToken = await generateRefreshToken(user);

  await prisma.user.update({
    where: { id: user.id },
    data: { accessToken: token, refreshToken },
  });

  setCookies(res, token, refreshToken);

  res.status(StatusCodes.OK).json({ user: omitPrivate(user) });
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new UnauthenticatedError('No refresh token provided');
  }

  const payload = (await paseto.verify(refreshToken, privateKeyPEM)) as any;
  if (!payload) {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
  });

  if (!user || user.refreshToken !== refreshToken) {
    throw new UnauthenticatedError('Invalid refresh token');
  }

  const newAccessToken = await paseto.sign({ id: user.id }, privateKeyPEM);
  const newRefreshToken = await generateRefreshToken(user);

  await prisma.user.update({
    where: { id: user.id },
    data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
  });

  setCookies(res, newAccessToken, newRefreshToken);

  res.status(StatusCodes.OK).json({ message: 'Access token refreshed' });
};
