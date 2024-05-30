import { prisma } from '_app/prisma/client';
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
}) => {
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

const DeleteEvent = async ({ id, authorId }: { id: string; authorId: string }) => {
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

const ExpressInterest = async (eventId: string, userId: string) => {
  const event = await prisma.event.findUnique({ where: { id: eventId } });

  if (!event) {
    throw new Error('Event not found');
  }

  const existingInteraction = await prisma.eventInteraction.findUnique({
    where: {
      eventId_userId_type: {
        eventId,
        userId,
        type: 'INTERESTED',
      },
    },
  });

  if (existingInteraction) {
    throw new Error('You have already expressed interest in this event');
  }

  await prisma.eventInteraction.create({
    data: {
      eventId,
      userId,
      type: 'INTERESTED',
    },
  });

  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: {
      interested: event.interested + 1,
    },
  });

  return updatedEvent;
};

const MarkWillAttend = async (eventId: string, userId: string) => {
  const event = await prisma.event.findUnique({ where: { id: eventId } });

  if (!event) {
    throw new Error('Event not found');
  }

  const existingInteraction = await prisma.eventInteraction.findUnique({
    where: {
      eventId_userId_type: {
        eventId,
        userId,
        type: 'WILL_ATTEND',
      },
    },
  });

  if (existingInteraction) {
    throw new Error('You have already marked that you will attend this event');
  }

  await prisma.eventInteraction.create({
    data: {
      eventId,
      userId,
      type: 'WILL_ATTEND',
    },
  });

  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: {
      willAttend: event.willAttend + 1,
    },
  });

  return updatedEvent;
};

export { CreateEvent, UpdateEvent, DeleteEvent, ExpressInterest, MarkWillAttend };
