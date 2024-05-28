import { prisma } from '_app/prisma/client';
import { RegisterUser } from '_app/interfaces';
import bcrypt from 'bcrypt';
import { alreadyExistsError, badRequestError } from '_app/errors';
import checkPasswordStrength from '_app/utils/checkPasswordStrength';
import validateRequiredFields from '_app/utils/validateRequiredFields';

export const registerUser = async ({
  username,
  email,
  password,
  firstName,
  lastName,
  profilePicture,
}: RegisterUser) => {
  const requiredFields = ['username', 'email', 'password'];
  validateRequiredFields({ username, email, password }, requiredFields);

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw alreadyExistsError('User already exists');
  }

  // if (!checkPasswordStrength(password)) {
  //   const feedback = [];

  //   if (password.length < 8) {
  //     feedback.push('Password must be at least 8 characters long.');
  //   }
  //   if (!/\d/.test(password)) {
  //     feedback.push('Password must include at least one number.');
  //   }
  //   if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
  //     feedback.push('Password must include at least one special character (e.g., !, @, #).');
  //   }
  //   const feedbackMessage = feedback.join(' ');

  //   throw badRequestError(feedbackMessage || 'Password does not meet the required criteria.');
  // }

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
