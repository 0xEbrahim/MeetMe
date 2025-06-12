import { IEmail } from "../models/models";

export interface IEmailRepository {
    send(data: IEmail) : Promise<void>
}