import { container, inject, injectable } from "tsyringe";
import UserRepository from "../infrastructure/database/repositories/UserRepository";
import { IFindUsers } from "../domain/models/IFindUsers";
import ApiResponse from "../../../shared/utils/ApiResponse";

@injectable()
class FindUserService {
  constructor(
    @inject("UserRepository") private readonly UserRepository: UserRepository
  ) {}

  async exec(data: IFindUsers) {
    const users = await this.UserRepository.find(data);
    return ApiResponse.OK({ users });
  }
}

export default FindUserService;
