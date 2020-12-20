import { Database } from 'better-sqlite3';

import { IAsyncStorage } from '../react-native/types';

export interface ReactNativeStorageOptions {
  asyncStorage: IAsyncStorage;
}

export interface NodeJSStorageOptions {
  database: string | Database;
}

export interface KeyValueStorageOptionsReactNative {
  ['react-native']: ReactNativeStorageOptions;
}

export interface KeyValueStorageOptionsNodeJS {
  ['node-js']: NodeJSStorageOptions;
}

export type KeyValueStorageOptions = Partial<
  KeyValueStorageOptionsReactNative & KeyValueStorageOptionsNodeJS
>;
export abstract class IKeyValueStorage {
  constructor(opts?: KeyValueStorageOptions) {}
  public abstract init(): Promise<void>;
  public abstract close(): Promise<void>;
  public abstract getKeys(): Promise<string[]>;
  public abstract getEntries(): Promise<[string, any][]>;
  public abstract getItem<T = any>(key: string): Promise<T | undefined>;
  public abstract setItem<T = any>(key: string, value: T): Promise<void>;
  public abstract removeItem(key: string): Promise<void>;
}
