import stringify from "fast-json-stable-stringify";
import { inject, injectable } from "tsyringe";
import RedisRepository from "../Repositories/RedisRepository";

@injectable()
class SetCacheService {
  constructor(
    @inject("RedisRepository") private readonly RedisRepository: RedisRepository
  ) {}

  async exec(prefix: string, key: any, data: any) {
    key = stringify(key);
    key = `${prefix}:${key}`;
    data = JSON.stringify(data);
    await this.RedisRepository.set(key, data);
  }
}

export default SetCacheService;
