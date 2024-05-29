import { Response } from "express";
import ms from "ms";

const setCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  const isProduction = process.env.NODE_ENV === "production";

  const accessTokenExpiry = isProduction ? ms("15m") : ms("1h");
  const refreshTokenExpiry = isProduction ? ms("7d") : ms("14d");

  res.cookie("accessToken", accessToken, {
    expires: new Date(Date.now() + accessTokenExpiry),
    secure: true,
    sameSite: "none",
    httpOnly: true,
  });

  res.cookie("refreshToken", refreshToken, {
    expires: new Date(Date.now() + refreshTokenExpiry),
    secure: true,
    sameSite: "none",
    httpOnly: true,
  });
};

export default setCookies;
