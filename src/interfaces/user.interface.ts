export interface RegisterUser {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  refreshToken?: string;
  forgotPasswordToken?: string;
  forgotPasswordExpire?: Date;
}
