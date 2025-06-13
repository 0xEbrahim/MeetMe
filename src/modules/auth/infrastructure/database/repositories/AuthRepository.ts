import UserRepository from "../../../../users/infrastructure/database/repositories/UserRepository";
import { IAuthRepository } from "../../../domain/repositories/IAuthRepository";

class AuthRepository extends UserRepository implements IAuthRepository {}

export default AuthRepository;
