export interface IRedisRepository {
  set(key: string, data: any): Promise<void>;
  get(key: string): Promise<string | null>;
  delete(key: string): Promise<void>;
}
