import { IUpdateUserInput } from '_app/interfaces';
import { prisma } from '_app/prisma/client';
import bcrypt from 'bcrypt';

const UpdateUser = async (id: string, data: IUpdateUserInput, userId: string) => {
  if (id !== userId) {
    throw new Error('You are not authorized to update this user');
  }

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data,
  });

  return updatedUser;
};

const DeleteUser = async (id: string, userId: string) => {
  if (id !== userId) {
    throw new Error('You are not authorized to delete this user');
  }

  const deletedUser = await prisma.$transaction(async (prisma) => {
    await prisma.eventInteraction.deleteMany({
      where: { userId: id },
    });

    const user = await prisma.user.delete({
      where: { id },
    });

    return user;
  });

  return deletedUser;
};

export { UpdateUser, DeleteUser };
