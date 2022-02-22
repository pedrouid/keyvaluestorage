import { IAsyncStorage, IMMKVStorage } from '../react-native/types';

export { IKeyValueStorage } from 'keyvaluestorage-interface';
export type ReactNativeStorageOptions =
  | {
      asyncStorage: IAsyncStorage;
    }
  | {
      mmkvStorage: IMMKVStorage;
    };

export interface NodeJSStorageOptions {
  database: string;
  tableName?: string;
}

export type KeyValueStorageOptions = Partial<
  ReactNativeStorageOptions & NodeJSStorageOptions
>;
