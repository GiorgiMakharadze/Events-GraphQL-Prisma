import { prisma } from '_app/prisma/client';
import { unauthorizedError } from '_app/errors';
import { IEvent } from '_app/interfaces';
const CreateEvent = async ({
  name,
  interested = 0,
  willAttend = 0,
  description,
  place,
  date,
  authorId,
}) => {
  const event = await prisma.event.create({
    data: {
      name,
      interested,
      willAttend,
      description,
      place,
      date,
      author: {
        connect: {
          id: authorId,
        },
      },
    },
    include: {
      author: true,
    },
  });
  return event;
};

const UpdateEvent = async ({
  id,
  name,
  interested,
  willAttend,
  description,
  place,
  date,
  authorId,
}: IEvent) => {
  const event = await prisma.event.findUnique({ where: { id } });

  if (!event) {
    throw new Error('Event not found');
  }

  if (event.authorId !== authorId) {
    throw new Error('You are not authorized to update this event');
  }

  const updatedEvent = await prisma.event.update({
    where: {
      id,
    },
    data: {
      name,
      interested,
      willAttend,
      description,
      place,
      date,
    },
    include: {
      author: true,
    },
  });

  return updatedEvent;
};

const DeleteEvent = async ({ id, authorId }) => {
  const event = await prisma.event.findUnique({ where: { id } });

  if (!event) {
    throw new Error('Event not found');
  }

  if (event.authorId !== authorId) {
    throw new Error('You are not authorized to delete this event');
  }

  const deletedEvent = await prisma.event.delete({
    where: {
      id,
    },
  });

  return deletedEvent;
};

export { CreateEvent, UpdateEvent, DeleteEvent };
