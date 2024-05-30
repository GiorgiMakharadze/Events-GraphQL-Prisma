import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import ms from 'ms';
import { V4 as paseto } from 'paseto';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '_app/prisma/client';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
} from '_app/rest/errors';
import generateRefreshToken from '_app/utils/refreshToken';
import setCookies from '_app/utils/setCookies';
import { privateKeyPEM } from '_app/utils';
import omitPrivate from '_app/utils/omitPrivate';
import { verifyAccessToken, verifyRefreshToken } from '_rest/utils';
import sendMail from '_rest/utils/sendEmail';

const logIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Email and password are required' });
  }

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

const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new UnauthenticatedError('No refresh token provided');
  }

  const payload = await paseto.verify(refreshToken, privateKeyPEM);
  if (!payload || typeof payload.id !== 'string') {
    throw new UnauthenticatedError('Invalid or expired refresh token');
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

const verifyToken = async (req: Request, res: Response) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  let payload: { id: string } | null = null;

  if (accessToken) {
    try {
      payload = (await verifyAccessToken(accessToken)) as { id: string };
    } catch (err) {
      console.error('Access token verification error:', err);
    }
  }

  if (!payload && refreshToken) {
    try {
      payload = (await verifyRefreshToken(refreshToken)) as { id: string };
    } catch (err) {
      console.error('Refresh token verification error:', err);
    }

    if (!payload) {
      throw new UnauthenticatedError('Invalid refresh token');
    }
  }

  if (!payload) {
    throw new UnauthenticatedError('No valid token provided');
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
  });

  if (!user) {
    throw new UnauthorizedError('Invalid token: user not found');
  }

  res.status(StatusCodes.OK).json({ message: 'Token is valid', user: omitPrivate(user) });
};

const logOut = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'No refresh token provided' });
  }

  const user = await prisma.user.findFirst({ where: { refreshToken } });

  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: null, accessToken: null },
    });
  }

  res.clearCookie('accessToken', { secure: true, sameSite: 'none' });
  res.clearCookie('refreshToken', { secure: true, sameSite: 'none' });

  res.status(StatusCodes.OK).json({ msg: 'Successfully logged out' });
};

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new BadRequestError('User not found');
  }

  const forgotToken = crypto.randomBytes(20).toString('hex');
  const hashedResetToken = crypto.createHash('sha256').update(forgotToken).digest('hex');
  const forgotTokenExpire = new Date(Date.now() + ms('1h'));

  await prisma.user.update({
    where: { email },
    data: {
      forgotPasswordToken: hashedResetToken,
      forgotPasswordTokenExpire: forgotTokenExpire,
    },
  });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-forgotten-password?token=${forgotToken}`;

  await sendMail({
    to: user.email,
    subject: 'Password Reset Request',
    text: `To reset your password, please click on the following link: ${resetUrl}`,
  });

  if (!sendMail) {
    throw new InternalServerError('Failed to send email. Please try again later.');
  }

  res.status(StatusCodes.OK).json({ message: 'Email sent. Please check your inbox.' });
};

const forgotPasswordConfirm = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await prisma.user.findFirst({
    where: {
      forgotPasswordToken: hashedToken,
      forgotPasswordTokenExpire: {
        gte: new Date(),
      },
    },
  });

  if (!user) {
    throw new BadRequestError('Invalid or expired password reset token.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      forgotPasswordToken: null,
      forgotPasswordTokenExpire: null,
    },
  });

  res.status(StatusCodes.OK).json({ message: 'Password has been reset successfully.' });
};

export { logIn, forgotPassword, forgotPasswordConfirm, logOut, verifyToken, refreshAccessToken };
