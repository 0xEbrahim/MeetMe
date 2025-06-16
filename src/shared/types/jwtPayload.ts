import { JwtPayload } from "jsonwebtoken";

export interface jwtPayload extends JwtPayload {
  id: string;
}
