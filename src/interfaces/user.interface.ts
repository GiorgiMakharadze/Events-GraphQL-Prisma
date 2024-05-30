export interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  accessToken?: string;
  refreshToken?: string;
  forgotPasswordToken?: string | null;
  forgotPasswordTokenExpire?: Date | null;
}
