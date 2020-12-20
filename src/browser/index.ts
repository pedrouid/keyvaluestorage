import localStorage from 'localStorage';
import { safeJsonParse, safeJsonStringify } from 'safe-json-utils';

import { IKeyValueStorage } from '../shared';

export class KeyValueStorage implements IKeyValueStorage {
  private readonly localStorage: Storage = localStorage;

  init(): Promise<void> {
    return Promise.resolve();
  }

  close(): Promise<void> {
    return Promise.resolve();
  }

  async getItem<T>(key: string): Promise<T | undefined> {
    const item = this.localStorage.getItem(key);
    if (item === null) {
      return undefined;
    }
    return safeJsonParse(item) as T;
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    this.localStorage.setItem(key, safeJsonStringify(value));
  }

  async removeItem(key: string): Promise<void> {
    this.localStorage.removeItem(key);
  }

  async getKeys(): Promise<string[]> {
    return Object.keys(this.localStorage);
  }

  async getEntries(): Promise<[string, any][]> {
    return Object.entries(this.localStorage);
  }
}

export default KeyValueStorage;
