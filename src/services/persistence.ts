export interface Persistence {
  initDatabase(): Promise<boolean>;

  saveOne<T>(item: T, params?: Record<string, any>): Promise<boolean>;

  saveMany<T>(items: T[], params?: Record<string, any>): Promise<boolean>;

  getOne<T>(query: any, params?: Record<string, any>): Promise<T | undefined>;

  getMany<T>(query: any, params?: Record<string, any>): Promise<T[]>;

  deleteOne(query: any, params?: Record<string, any>): Promise<boolean>;

  deleteMany(query: any, params?: Record<string, any>): Promise<number>;

  testDb(): Promise<boolean>;

  updateOne(
    query: any,
    updates: Record<string, any>,
    params?: Record<string, any>,
  ): Promise<boolean>;

  updateMany(
    query: any,
    updates: Record<string, any>,
    params?: Record<string, any>,
  ): Promise<number>;
}
