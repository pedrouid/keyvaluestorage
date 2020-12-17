import { safeJsonParse, safeJsonStringify } from 'safe-json-utils';
import localStorage from 'localStorage';

import { STORE_DEFAULT } from '../constants';
import { IKeyValueStorage } from '../shared';

export class KeyValueStorage implements IKeyValueStorage {
  private localStorage: Storage = localStorage;

  constructor(
    private readonly prefix: string = STORE_DEFAULT.PREFIX,
    private readonly separator: string = STORE_DEFAULT.SEPARATOR
  ) {}

  init(): Promise<void> {
    return Promise.resolve();
  }

  close(): Promise<void> {
    return Promise.resolve();
  }

  async getItem<T>(key: string): Promise<T | undefined> {
    const item = this.localStorage.getItem(
      `${this.prefix}${this.separator}${key}`
    );
    // TODO: fix type casting
    return safeJsonParse(item as any) as any;
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    this.localStorage.setItem(
      `${this.prefix}${this.separator}${key}`,
      safeJsonStringify(value)
    );
  }

  async removeItem(key: string): Promise<void> {
    this.localStorage.removeItem(`${this.prefix}${this.separator}${key}`);
  }

  async getKeys(): Promise<string[]> {
    const relevantKeys = Object.keys(this.localStorage).filter(key =>
      key.startsWith(this.prefix)
    );
    return relevantKeys.map(
      key => key.split(`${this.prefix}${this.separator}`)[1]
    );
  }

  async getEntries(): Promise<[string, any][]> {
    return Object.entries(this.localStorage)
      .filter(([name, _]) => name.startsWith(this.prefix))
      .map(([name, value]) => [
        name.replace(`${this.prefix}${this.separator}`, ''),
        safeJsonParse(value),
      ]);
  }

  getKey(...args: string[]) {
    return args.join(this.separator);
  }
}

export default KeyValueStorage;
