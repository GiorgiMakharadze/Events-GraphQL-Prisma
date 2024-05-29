import { unauthorizedError } from '_app/errors';
import { getAllUsers, getUserById, getAllEvents, getEventById } from '_app/services/admin.service';

const Query = {
  getUsers: async (_root, _args, { user }) => {
    if (!user) {
      throw unauthorizedError('Missing authentication');
    }
    return getAllUsers();
  },
  getUser: async (_root, { id }, { user }) => {
    if (!user) {
      throw unauthorizedError('Missing authentication');
    }
    return getUserById(id);
  },
  getEvents: async (_root, _args, { user }) => {
    if (!user) {
      throw unauthorizedError('Missing authentication');
    }
    return getAllEvents();
  },
  getEvent: async (_root, { id }, { user }) => {
    if (!user) {
      throw unauthorizedError('Missing authentication');
    }
    return getEventById(id);
  },
};

export default Query;
