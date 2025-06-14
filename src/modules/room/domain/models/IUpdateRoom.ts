import { ICreateRoom } from "./ICreateRoom";

export interface IUpdateRoom extends Partial<ICreateRoom> {
  userId: string;
}
