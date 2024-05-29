import { prisma } from '_app/prisma/client';
import { notFoundError, badRequestError } from '_app/errors';

export const getAllUsers = async () => {
  const users = await prisma.user.findMany();
  if (!users || users.length === 0) {
    throw badRequestError('Users not found');
  }
  return users;
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw notFoundError('User not found');
  }
  return user;
};

export const getAllEvents = async () => {
  const events = await prisma.event.findMany();
  if (!events || events.length === 0) {
    throw badRequestError('Events not found');
  }
  return events;
};

export const getEventById = async (id: string) => {
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) {
    throw notFoundError('Event not found');
  }
  return event;
};
