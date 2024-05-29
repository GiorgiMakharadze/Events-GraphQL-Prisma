const omitPrivate = (user: any) => {
  const {
    password,
    accessToken,
    refreshToken,
    forgotPasswordToken,
    forgotPasswordTokenExpire,
    ...publicData
  } = user;
  return publicData;
};

export default omitPrivate;
