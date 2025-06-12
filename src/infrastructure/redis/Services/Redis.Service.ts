import stringify from "fast-json-stable-stringify";
import { inject, injectable } from "tsyringe";
import { IRedisRepository } from "../Repositories/IRedisRepository";

@injectable()
class RedisService {
  constructor(
    @inject("RedisRepository")
    private readonly RedisRepository: IRedisRepository
  ) {}

  async delete(prefix: string, key: any) {
    if (typeof key !== "string") key = stringify(key);
    key = `${prefix}:${key}`;
    const keys = await this.RedisRepository.keys(key);
    for (let i = 0; i < keys.length; i++)
      await this.RedisRepository.delete(keys[i]);
  }

  async get(prefix: string, key: any): Promise<string | null> {
    key = stringify(key);
    key = `${prefix}:${key}`;
    const data = await this.RedisRepository.get(key);
    return data;
  }

  async set(prefix: string, key: any, data: any) {
    key = stringify(key);
    key = `${prefix}:${key}`;
    data = JSON.stringify(data);
    await this.RedisRepository.set(key, data);
  }
}

export default RedisService;
