import env from "../../../shared/constant/env";
import { IRedisRepository } from "./IRedisRepository";
import Redis from "ioredis";

class RedisRepository implements IRedisRepository {
  private redis: Redis;
  constructor() {
    this.redis = new Redis(env.REDIS_URI);
  }
  async set(key: string, data: string): Promise<void> {
    await this.redis.set(key, data);
  }
  async get(key: string): Promise<string | null> {
    const cached = await this.redis.get(key);
    return cached;
  }
  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async keys(key: string): Promise<string[]> {
    return await this.redis.keys(key);
  }
}

export default RedisRepository;
