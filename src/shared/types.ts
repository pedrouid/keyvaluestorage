export interface IKeyValueStorage {
  init(): Promise<void>;
  close(): Promise<void>;
  getKey(...args: string[]): string; // generates a key for related subject strings
  getKeys(): Promise<string[]>;
  getEntries(): Promise<[string, any][]>;
  getItem<T = any>(key: string): Promise<T | undefined>;
  setItem<T = any>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
}
