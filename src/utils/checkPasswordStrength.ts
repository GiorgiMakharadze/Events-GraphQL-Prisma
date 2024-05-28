const checkPasswordStrength = (password: string): boolean => {
  const minLength = 10;
  const hasNumber = /\d/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
  return password.length >= minLength && hasNumber.test(password) && hasSpecialChar.test(password);
};
export default checkPasswordStrength;
