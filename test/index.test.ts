import { delay } from '@pedrouid/timestamp';

import BrowserStorage from '../src/browser';
import ReactNativeStorage from '../src/react-native';
import NodeJSStorage from '../src/node-js';
import { IKeyValueStorage } from '../src/shared';

import MockAsyncStorage from './mock/asyncstorage';
import { MockStore } from './mock';

const TEST_REACT_NATIVE_OPTIONS = {
  asyncStorage: new MockAsyncStorage(),
};

const TEST_NODE_JS_OPTIONS_MEMORY = {
  database: ':memory:',
};

const TEST_NODE_JS_OPTIONS_PERSISTED = {
  database: 'test/test.db',
};

describe('KeyValueStorage', () => {
  const key = 'yolo';
  const value = { name: 'john doe' };
  let storage: IKeyValueStorage;

  describe('browser', () => {
    beforeAll(async () => {
      storage = new BrowserStorage();
      await storage.setItem(key, value);
    });
    it('getItem', async () => {
      const item = await storage.getItem<typeof value>(key);
      if (typeof item === 'undefined') throw new Error('item is missing');
      expect(item).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.name).toEqual(value.name);
    });
    it('getEntries', async () => {
      const entries = await storage.getEntries();
      expect(entries).toBeTruthy();
      expect(entries.length).toEqual(1);
      expect(entries[0]).toEqual([key, value]);
    });
    it('getKeys', async () => {
      const keys = await storage.getKeys();
      expect(keys).toBeTruthy();
      expect(keys.length).toEqual(1);
      expect(keys[0]).toEqual(key);
    });
    it('removeItem', async () => {
      await storage.removeItem(key);
      const item = await storage.getItem(key);
      if (typeof item !== 'undefined')
        throw new Error('item expected to be undefined');
      expect(item).toBeFalsy();
    });
  });

  describe('react-native', () => {
    beforeAll(async () => {
      storage = new ReactNativeStorage(TEST_REACT_NATIVE_OPTIONS);
      await storage.setItem(key, value);
    });
    it('getItem', async () => {
      const item = await storage.getItem<typeof value>(key);
      if (typeof item === 'undefined') throw new Error('item is missing');
      expect(item).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.name).toEqual(value.name);
    });
    it('getEntries', async () => {
      const entries = await storage.getEntries();
      expect(entries).toBeTruthy();
      expect(entries.length).toEqual(1);
      expect(entries[0]).toEqual([key, value]);
    });
    it('getKeys', async () => {
      const keys = await storage.getKeys();
      expect(keys).toBeTruthy();
      expect(keys.length).toEqual(1);
      expect(keys[0]).toEqual(key);
    });
    it('removeItem', async () => {
      await storage.removeItem(key);
      const item = await storage.getItem(key);
      if (typeof item !== 'undefined')
        throw new Error('item expected to be undefined');
      expect(item).toBeFalsy();
    });
  });

  describe('node-js', () => {
    beforeAll(async () => {
      storage = new NodeJSStorage(TEST_NODE_JS_OPTIONS_MEMORY);
      await storage.setItem(key, value);
    });
    it('getItem', async () => {
      const item = await storage.getItem<typeof value>(key);
      if (typeof item === 'undefined') throw new Error('item is missing');
      expect(item).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.name).toEqual(value.name);
    });
    it('getEntries', async () => {
      const entries = await storage.getEntries();
      expect(entries).toBeTruthy();
      expect(entries.length).toEqual(1);
      expect(entries[0]).toEqual([key, value]);
    });
    it('getKeys', async () => {
      const keys = await storage.getKeys();
      expect(keys).toBeTruthy();
      expect(keys.length).toEqual(1);
      expect(keys[0]).toEqual(key);
    });
    it('removeItem', async () => {
      await storage.removeItem(key);
      const item = await storage.getItem(key);
      if (typeof item !== 'undefined')
        throw new Error('item expected to be undefined');
      expect(item).toBeFalsy();
    });
  });

  describe('persistence', () => {
    it('two storages can access the same item', async () => {
      let storageA = new NodeJSStorage(TEST_NODE_JS_OPTIONS_PERSISTED);
      await storageA.setItem(key, value);
      const itemA = await storageA.getItem<typeof value>(key);
      if (typeof itemA === 'undefined')
        throw new Error('item expected to be undefined');
      expect(itemA).toBeTruthy();
      expect(itemA.name).toBeTruthy();
      expect(itemA.name).toEqual(value.name);
      let storageB = new NodeJSStorage(TEST_NODE_JS_OPTIONS_PERSISTED);
      const itemB = await storageB.getItem<typeof value>(key);
      if (typeof itemB === 'undefined')
        throw new Error('item expected to be undefined');
      expect(itemB).toBeTruthy();
      expect(itemB.name).toBeTruthy();
      expect(itemB.name).toEqual(value.name);
    });
    it('two classes can share the same storage', async () => {
      let storage = new NodeJSStorage(TEST_NODE_JS_OPTIONS_PERSISTED);
      let storeA = new MockStore(storage);
      await storeA.set(key, value);
      const itemA = await storeA.get<typeof value>(key);
      if (typeof itemA === 'undefined')
        throw new Error('item expected to be undefined');
      expect(itemA).toBeTruthy();
      expect(itemA.name).toBeTruthy();
      expect(itemA.name).toEqual(value.name);
      let storeB = new MockStore(storage);
      const itemB = await storeB.get<typeof value>(key);
      if (typeof itemB === 'undefined')
        throw new Error('item expected to be undefined');
      expect(itemB).toBeTruthy();
      expect(itemB.name).toBeTruthy();
      expect(itemB.name).toEqual(value.name);
    });
    it('three storages can write synchronously', async () => {
      let storageA = new NodeJSStorage(TEST_NODE_JS_OPTIONS_PERSISTED);
      storageA.setItem(key, { ...value, owner: 'storageA' });

      let storageB = new NodeJSStorage(TEST_NODE_JS_OPTIONS_PERSISTED);
      storageB.setItem(key, { ...value, owner: 'storageB' });

      let storageC = new NodeJSStorage(TEST_NODE_JS_OPTIONS_PERSISTED);
      storageC.setItem(key, { ...value, owner: 'storageC' });

      await delay(2000);

      const itemA = await storageA.getItem<typeof value>(key);

      if (typeof itemA === 'undefined')
        throw new Error('item expected to be undefined');
      expect(itemA).toBeTruthy();
      expect(itemA.name).toBeTruthy();
      expect(itemA.name).toEqual(value.name);
      expect((itemA as any).owner).toEqual('storageC');

      const itemB = await storageB.getItem<typeof value>(key);
      if (typeof itemB === 'undefined')
        throw new Error('item expected to be undefined');
      expect(itemB).toBeTruthy();
      expect(itemB.name).toBeTruthy();
      expect(itemB.name).toEqual(value.name);
      expect((itemB as any).owner).toEqual('storageC');

      const itemC = await storageB.getItem<typeof value>(key);
      if (typeof itemC === 'undefined')
        throw new Error('item expected to be undefined');
      expect(itemC).toBeTruthy();
      expect(itemC.name).toBeTruthy();
      expect(itemC.name).toEqual(value.name);
      expect((itemC as any).owner).toEqual('storageC');
    });
  });
});
