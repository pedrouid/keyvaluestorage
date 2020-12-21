import { Database } from 'better-sqlite3';

import { IAsyncStorage } from '../react-native/types';

export interface ReactNativeStorageOptions {
  asyncStorage: IAsyncStorage;
}

export interface NodeJSStorageOptions {
  database: string | Database;
  tableName?: string;
}

export type KeyValueStorageOptions = Partial<
  ReactNativeStorageOptions & NodeJSStorageOptions
>;
export abstract class IKeyValueStorage {
  public abstract getKeys(): Promise<string[]>;
  public abstract getEntries<T = any>(): Promise<[string, T][]>;
  public abstract getItem<T = any>(key: string): Promise<T | undefined>;
  public abstract setItem<T = any>(key: string, value: T): Promise<void>;
  public abstract removeItem(key: string): Promise<void>;
}
