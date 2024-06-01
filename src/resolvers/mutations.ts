import { unauthorizedError } from '_app/errors';
import { RegisterUser } from '_app/services/auth.service';
import {
  CreateEvent,
  UpdateEvent,
  DeleteEvent,
  ExpressInterest,
  MarkWillAttend,
} from '_app/services/events.service';
import { DeleteUser, UpdateUser } from '_app/services/user.service';

const Mutation = {
  register: async (_root, { data }) => await RegisterUser(data),

  createEvent: async (_root, { data }, { user }) => {
    if (!user) {
      throw unauthorizedError('Missing authentication');
    }
    const eventData = {
      ...data,
    };
    const event = await CreateEvent(eventData);
    return event;
  },
  updateEvent: async (_root, { id, data }, { user }) => {
    if (!user) {
      throw unauthorizedError('Missing authentication');
    }
    const eventData = {
      id,
      ...data,
    };
    const event = await UpdateEvent(eventData);
    return event;
  },
  deleteEvent: async (_root, { id }, { user }) => {
    if (!user) {
      throw unauthorizedError('Missing authentication');
    }
    const event = await DeleteEvent({ id, authorId: user.id });
    return event;
  },

  expressInterest: async (_root, { eventId }, { user }) => {
    if (!user) {
      throw unauthorizedError('Missing authentication');
    }
    const event = await ExpressInterest(eventId, user.id);
    return event;
  },
  markWillAttend: async (_root, { eventId }, { user }) => {
    if (!user) {
      throw unauthorizedError('Missing authentication');
    }
    const event = await MarkWillAttend(eventId, user.id);
    return event;
  },

  updateUser: async (_root, { data }, { user }) => {
    if (!user) {
      throw unauthorizedError('Missing authentication');
    }
    7;
    const updatedUser = await UpdateUser(user.id, data, user.id);
    return updatedUser;
  },
  deleteUser: async (_root, _args, { user }) => {
    if (!user) {
      throw unauthorizedError('Missing authentication');
    }
    const deletedUser = await DeleteUser(user.id, user.id);
    return deletedUser;
  },
};

export default Mutation;
