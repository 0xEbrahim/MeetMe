import jwt, { JwtPayload } from "jsonwebtoken";
import env from "../../constant/env";

interface jwtPayload extends JwtPayload {
  id: string;
}

export const generateAccessToken = async (id: string) => {
  return await jwt.sign({ id }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  });
};

export const verfiyAccessToken = async (token: string): Promise<jwtPayload> => {
  return (await jwt.verify(
    token,
    env.ACCESS_TOKEN_SECRET
  )) as Promise<jwtPayload>;
};

export const generateRefreshToken = async (id: string) => {
  return await jwt.sign({ id }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: "60d",
  });
};

export const verfiyRefreshToken = async (
  token: string
): Promise<jwtPayload> => {
  return (await jwt.verify(
    token,
    env.REFRESH_TOKEN_SECRET
  )) as Promise<jwtPayload>;
};
