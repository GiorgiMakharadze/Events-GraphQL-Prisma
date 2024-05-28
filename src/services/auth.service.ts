import { prisma } from '_app/prisma/client';
import { RegisterUser } from '_app/interfaces';
import bcrypt from 'bcrypt';

export const registerUser = async ({
  username,
  email,
  password,
  firstName,
  lastName,
  profilePicture,
}: RegisterUser) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      email,
      firstName,
      lastName,
      profilePicture,
      password: hashedPassword,
    },
  });
  return user;
};
