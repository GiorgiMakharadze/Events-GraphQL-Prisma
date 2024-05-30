import bcrypt from 'bcrypt';
import { prisma } from '_app/prisma/client';
import { IUser } from '_app/interfaces';
import { alreadyExistsError } from '_app/errors';

export const RegisterUser = async ({
  username,
  email,
  password,
  firstName,
  lastName,
  profilePicture,
}: IUser) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw alreadyExistsError('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userCount = await prisma.user.count();
  const role = userCount === 0 ? 'MAIN_ADMIN' : 'USER';

  const user = await prisma.user.create({
    data: {
      username,
      email,
      firstName,
      lastName,
      profilePicture,
      password: hashedPassword,
      role,
      accessToken: '',
      refreshToken: '',
      forgotPasswordToken: null,
      forgotPasswordTokenExpire: null,
    },
  });
  return user;
};
