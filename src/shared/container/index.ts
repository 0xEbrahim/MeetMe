import { container } from "tsyringe";
import { IUserRepository } from "../../modules/users/domain/repositories/IUserRepository";
import UserRepository from "../../modules/users/infrastructure/database/repositories/UserRepository";
import { IEmailRepository } from "../../infrastructure/email/Repositories/IEmailRepository";
import EmailRepository from "../../infrastructure/email/Repositories/EmailRepository";
import { IRedisRepository } from "../../infrastructure/redis/Repositories/IRedisRepository";
import RedisRepository from "../../infrastructure/redis/Repositories/RedisRepository";
import { IAuthRepository } from "../../modules/auth/domain/repositories/IAuthRepository";
import AuthRepository from "../../modules/auth/infrastructure/database/repositories/AuthRepository";

container.registerSingleton<IUserRepository>("UserRepository", UserRepository);
container.registerSingleton<IAuthRepository>("AuthRepository", AuthRepository);
container.registerSingleton<IEmailRepository>(
  "EmailRepository",
  EmailRepository
);
container.registerSingleton<IRedisRepository>(
  "RedisRepository",
  RedisRepository
);
