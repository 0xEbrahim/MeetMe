import { container } from "tsyringe";
import { IUserRepository } from "../../modules/users/domain/repositories/IUserRepository";
import UserRepository from "../../modules/users/infrastructure/database/repositories/UserRepository";
import { IEmailRepository } from "../../infrastructure/email/Repositories/IEmailRepository";
import EmailRepository from "../../infrastructure/email/Repositories/EmailRepository";

container.registerSingleton<IUserRepository>("UserRepository", UserRepository);
container.registerSingleton<IEmailRepository>(
  "EmailRepository",
  EmailRepository
);
