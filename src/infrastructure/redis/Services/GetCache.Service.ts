import stringify from "fast-json-stable-stringify";
import { inject, injectable } from "tsyringe";
import RedisRepository from "../Repositories/RedisRepository";

@injectable()
class GetCacheService {
  constructor(
    @inject("RedisRepository") private readonly RedisRepository: RedisRepository
  ) {}

  async exec(prefix: string, key: any): Promise<string | null> {
    key = stringify(key);
    key = `${prefix}:${key}`;
    const data = await this.RedisRepository.get(key);
    return data;
  }
}

export default GetCacheService;
