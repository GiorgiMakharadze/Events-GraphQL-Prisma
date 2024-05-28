import { defaultFieldResolver } from 'graphql';

class PasswordStrengthDirective {
  visitInputFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;

    field.resolve = async function (...args) {
      const value = args[0];
      if (!checkPasswordStrength(value)) {
        const feedback = [];

        if (value.length < 10) {
          feedback.push('Password must be at least 10 characters long.');
        }
        if (!/\d/.test(value)) {
          feedback.push('Password must include at least one number.');
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
          feedback.push('Password must include at least one special character (e.g., !, @, #).');
        }
        const feedbackMessage = feedback.join(' ');

        throw new Error(feedbackMessage || 'Password does not meet the required criteria.');
      }

      return resolve.apply(this, args);
    };
  }
}

const checkPasswordStrength = (password) => {
  const minLength = 10;
  const hasNumber = /\d/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
  return password.length >= minLength && hasNumber.test(password) && hasSpecialChar.test(password);
};

export default PasswordStrengthDirective;
