import jwt from "jsonwebtoken";
import env from "../../constant/env";

export const generateAccessToken = async (id: string) => {
  return await jwt.sign({ id }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  });
};

export const verifyAccessToken = (token: string) => {
  const dec = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
  return dec;
};

export const generateRefreshToken = async (id: string) => {
  return await jwt.sign({ id }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: "60d",
  });
};

export const verifyRefreshToken = (token: string) => {
  const dec = jwt.verify(token, env.REFRESH_TOKEN_SECRET);
  return dec;
};
