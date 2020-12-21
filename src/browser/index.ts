import localStorage from 'localStorage';
import { safeJsonParse, safeJsonStringify } from 'safe-json-utils';

import { IKeyValueStorage, parseEntry } from '../shared';

export class KeyValueStorage implements IKeyValueStorage {
  private readonly localStorage: Storage = localStorage;

  public async getItem<T>(key: string): Promise<T | undefined> {
    const item = this.localStorage.getItem(key);
    if (item === null) {
      return undefined;
    }
    // TODO: fix this annoying type casting
    return safeJsonParse(item) as T;
  }

  public async setItem<T>(key: string, value: T): Promise<void> {
    this.localStorage.setItem(key, safeJsonStringify(value));
  }

  public async removeItem(key: string): Promise<void> {
    this.localStorage.removeItem(key);
  }

  public async getKeys(): Promise<string[]> {
    return Object.keys(this.localStorage);
  }

  public async getEntries(): Promise<[string, any][]> {
    return Object.entries(this.localStorage).map(parseEntry);
  }
}

export default KeyValueStorage;
