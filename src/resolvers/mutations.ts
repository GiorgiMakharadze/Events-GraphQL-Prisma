import { registerUser } from '_app/services/auth.service';

const Mutation = {
  register: async (_root, { data }) => await registerUser(data),
};

export default Mutation;
