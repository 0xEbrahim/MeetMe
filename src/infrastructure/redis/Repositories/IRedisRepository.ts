export interface IRedisRepository {
  keys(key: string): Promise<string[]>;
  set(key: string, data: any): void;
  get(key: string): Promise<string | null>;
  delete(key: string): Promise<void>;
  flush(): Promise<void>;
  disconnect(): Promise<void>;
}
