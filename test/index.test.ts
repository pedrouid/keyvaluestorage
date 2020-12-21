import BrowserStorage from '../src/browser';
import ReactNativeStorage from '../src/react-native';
import NodeJSStorage from '../src/node-js';
import { IKeyValueStorage } from '../src/shared';

import MockAsyncStorage from './mock/asyncstorage';

const TEST_REACT_NATIVE_OPTIONS = {
  // eslint-disable-next-line no-useless-computed-key
  ['react-native']: {
    asyncStorage: new MockAsyncStorage(),
  },
};

const TEST_NODE_JS_OPTIONS = {
  // eslint-disable-next-line no-useless-computed-key
  ['node-js']: {
    database: ':memory:',
  },
};

describe('KeyValueStorage', () => {
  const key = 'yolo';
  const value = { legacy: 'carpe diem' };
  let store: IKeyValueStorage;
  describe('browser', () => {
    beforeAll(async () => {
      store = new BrowserStorage();
      await store.setItem(key, value);
    });
    it('getItem', async () => {
      const item = await store.getItem<typeof value>(key);
      if (typeof item === 'undefined') throw new Error('item is missing');
      expect(item).toBeTruthy();
      expect(item.legacy).toBeTruthy();
      expect(item.legacy).toEqual(value.legacy);
    });
    it('getEntries', async () => {
      const entries = await store.getEntries();
      expect(entries).toBeTruthy();
      expect(entries.length).toEqual(1);
      expect(entries[0]).toEqual([key, value]);
    });
    it('getKeys', async () => {
      const keys = await store.getKeys();
      expect(keys).toBeTruthy();
      expect(keys.length).toEqual(1);
      expect(keys[0]).toEqual(key);
    });
    it('removeItem', async () => {
      await store.removeItem(key);
      const item = await store.getItem(key);
      if (typeof item !== 'undefined')
        throw new Error('item expected to be undefined');
      expect(item).toBeFalsy();
    });
  });

  describe('react-native', () => {
    beforeAll(async () => {
      store = new ReactNativeStorage(TEST_REACT_NATIVE_OPTIONS);
      await store.setItem(key, value);
    });
    it('getItem', async () => {
      const item = await store.getItem<typeof value>(key);
      if (typeof item === 'undefined') throw new Error('item is missing');
      expect(item).toBeTruthy();
      expect(item.legacy).toBeTruthy();
      expect(item.legacy).toEqual(value.legacy);
    });
    it('getEntries', async () => {
      const entries = await store.getEntries();
      expect(entries).toBeTruthy();
      expect(entries.length).toEqual(1);
      expect(entries[0]).toEqual([key, value]);
    });
    it('getKeys', async () => {
      const keys = await store.getKeys();
      expect(keys).toBeTruthy();
      expect(keys.length).toEqual(1);
      expect(keys[0]).toEqual(key);
    });
    it('removeItem', async () => {
      await store.removeItem(key);
      const item = await store.getItem(key);
      if (typeof item !== 'undefined')
        throw new Error('item expected to be undefined');
      expect(item).toBeFalsy();
    });
  });

  describe('node-js', () => {
    beforeAll(async () => {
      store = new NodeJSStorage(TEST_NODE_JS_OPTIONS);
      await store.setItem(key, value);
    });
    it('getItem', async () => {
      const item = await store.getItem<typeof value>(key);
      if (typeof item === 'undefined') throw new Error('item is missing');
      expect(item).toBeTruthy();
      expect(item.legacy).toBeTruthy();
      expect(item.legacy).toEqual(value.legacy);
    });
    it('getEntries', async () => {
      const entries = await store.getEntries();
      expect(entries).toBeTruthy();
      expect(entries.length).toEqual(1);
      expect(entries[0]).toEqual([key, value]);
    });
    it('getKeys', async () => {
      const keys = await store.getKeys();
      expect(keys).toBeTruthy();
      expect(keys.length).toEqual(1);
      expect(keys[0]).toEqual(key);
    });
    it('removeItem', async () => {
      await store.removeItem(key);
      const item = await store.getItem(key);
      if (typeof item !== 'undefined')
        throw new Error('item expected to be undefined');
      expect(item).toBeFalsy();
    });
  });
});
