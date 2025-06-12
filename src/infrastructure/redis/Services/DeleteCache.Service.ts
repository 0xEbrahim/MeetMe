import stringify from "fast-json-stable-stringify";
import { inject, injectable } from "tsyringe";
import RedisRepository from "../Repositories/RedisRepository";

@injectable()
class DeleteCacheService {
  constructor(
    @inject("RedisRepository") private readonly RedisRepository: RedisRepository
  ) {}

  async exec(prefix: string, key: any) {
    key = stringify(key);
    key = `${prefix}:${key}`;
    await this.RedisRepository.delete(key);
  }
}

export default DeleteCacheService;
