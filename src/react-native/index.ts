import { safeJsonParse, safeJsonStringify } from 'safe-json-utils';

import {
  IKeyValueStorage,
  KeyValueStorageOptions,
  getReactNativeOptions,
  parseEntry,
} from '../shared';

import { IAsyncStorage, IMMKVStorage } from './types';

function isAsyncStorage(
  storage: IAsyncStorage | IMMKVStorage
): storage is IAsyncStorage {
  return 'multiGet' in storage;
}

export class KeyValueStorage implements IKeyValueStorage {
  private readonly storage: IAsyncStorage | IMMKVStorage;

  constructor(opts?: KeyValueStorageOptions) {
    const options = getReactNativeOptions(opts);

    if ('asyncStorage' in options) {
      this.storage = options.asyncStorage;
    } else {
      this.storage = options.mmkvStorage;
    }
  }

  public async getKeys(): Promise<string[]> {
    return this.storage.getAllKeys();
  }

  public async getEntries<T = any>(): Promise<[string, T][]> {
    const s = this.storage;
    if (isAsyncStorage(s)) {
      const entries = await s.multiGet(await this.getKeys());
      return entries.map(parseEntry);
    } else {
      const keys = s.getAllKeys();
      const mapped = keys.map(k => [k, s.getString(k)] as const);
      return mapped.map(parseEntry);
    }
  }

  public async getItem<T = any>(key: string): Promise<T | undefined> {
    const getter = isAsyncStorage(this.storage)
      ? this.storage.getItem
      : this.storage.getString;
    const item = await getter(key);
    if (typeof item == 'undefined' || item === null) {
      return undefined;
    }
    // TODO: fix this annoying type casting
    return safeJsonParse(item) as T;
  }

  public async setItem<T = any>(key: string, value: T): Promise<void> {
    const setter = isAsyncStorage(this.storage)
      ? this.storage.setItem
      : this.storage.setString;
    await setter(key, safeJsonStringify(value));
  }

  public async removeItem(key: string): Promise<void> {
    const remover = isAsyncStorage(this.storage)
      ? this.storage.removeItem
      : this.storage.deleteKey;
    await remover(key);
  }
}

export default KeyValueStorage;
