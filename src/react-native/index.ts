import { safeJsonParse, safeJsonStringify } from 'safe-json-utils';

import {
  IKeyValueStorage,
  KeyValueStorageOptions,
  getReactNativeOptions,
} from '../shared';

import { IAsyncStorage } from './types';

export class KeyValueStorage implements IKeyValueStorage {
  private readonly asyncStorage: IAsyncStorage;

  constructor(opts?: KeyValueStorageOptions) {
    const options = getReactNativeOptions(opts);
    this.asyncStorage = options.asyncStorage;
  }

  init(): Promise<void> {
    return Promise.resolve();
  }

  close(): Promise<void> {
    return Promise.resolve();
  }

  async getItem<T>(key: string): Promise<T | undefined> {
    const item = await this.asyncStorage.getItem(key);
    if (typeof item == 'undefined') {
      return undefined;
    }
    return safeJsonParse(item) as T;
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    await this.asyncStorage.setItem(key, safeJsonStringify(value));
  }

  async removeItem(key: string): Promise<void> {
    await this.asyncStorage.removeItem(key);
  }
  async getKeys(): Promise<string[]> {
    return this.asyncStorage.getAllKeys();
  }

  async getEntries(): Promise<[string, any][]> {
    const entries = await this.asyncStorage.multiGet(await this.getKeys());
    return entries;
  }
}

export default KeyValueStorage;
