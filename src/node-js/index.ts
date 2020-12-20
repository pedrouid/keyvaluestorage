import Database, { Database as IDatabase } from 'better-sqlite3';
// import { mkdirSync } from 'fs';
// import { dirname } from 'path';

import {
  IKeyValueStorage,
  KeyValueStorageOptions,
  getNodeJSOptions,
} from '../shared';

export class KeyValueStorage implements IKeyValueStorage {
  private readonly database: IDatabase;

  constructor(opts?: KeyValueStorageOptions) {
    const options = getNodeJSOptions(opts);
    this.database =
      typeof options.database === 'string'
        ? new Database(options.database)
        : options.database;
  }

  ////////////////////////////////////////
  // Public Methods

  async init(): Promise<void> {
    return Promise.resolve();
  }

  async close(): Promise<void> {
    this.database.close();
  }

  async getKeys(): Promise<string[]> {
    // TODO: implement getKeys
    return [];
  }

  async getEntries(): Promise<[string, any][]> {
    // TODO: implement getEntries
    return [];
  }

  async getItem<T>(key: string): Promise<T | undefined> {
    // TODO: implement getItem
    return undefined;
  }

  async setItem(key: string, value: any): Promise<void> {
    // TODO: implement setItem
    return undefined;
  }

  async removeItem(key: string): Promise<void> {
    // TODO: implement removeItem
    return undefined;
  }
}

export default KeyValueStorage;
