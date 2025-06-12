import { inject, injectable } from "tsyringe";
import UserRepository from "../infrastructure/database/repositories/UserRepository";
import ApiResponse from "../../../shared/utils/ApiResponse";

/**
 * TODO:
 *  - Redis integration
 *  - Email Integration
 *  - Unit & Integration testing
 */

@injectable()
class DeleteUserService {
  constructor(
    @inject("UserRepository") private readonly UserRepository: UserRepository
  ) {}

  async exec(id: string) {
    const user = await this.UserRepository.findOne(id);
    if (!user) return ApiResponse.NotFound(`User with id: ${id} not found.`);
    const result = await this.UserRepository.delete(id);
    return ApiResponse.OK({ result });
  }
}

export default DeleteUserService;
