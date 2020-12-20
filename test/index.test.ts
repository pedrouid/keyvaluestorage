import BrowserStorage from '../src/browser';
import ReactNativeStorage from '../src/react-native';
// import NodeJSStorage from '../src/node-js';

import MockAsyncStorage from './mock/asyncstorage';

describe('KeyValueStorage', () => {
  // TODO: fix unit tests
  it('browser', async () => {
    const key = 'yolo';
    const value = { data: true };
    const store = new BrowserStorage();
    await store.init();
    await store.setItem(key, value);
    const result = await store.getItem<typeof value>(key);
    if (typeof result === 'undefined') throw new Error('result is undefined');
    expect(result).toBeTruthy();
    expect(result.data).toEqual(value.data);
  });
  it('react-native', async () => {
    const key = 'yolo';
    const value = { data: true };
    const store = new ReactNativeStorage(new MockAsyncStorage());
    await store.init();
    await store.setItem(key, value);
    const result = await store.getItem<typeof value>(key);
    if (typeof result === 'undefined') throw new Error('result is undefined');
    expect(result).toBeTruthy();
    expect(result.data).toEqual(value.data);
  });
  it('node-js', async () => {
    // TODO: fix NodeJS keyvaluestorage tests
    // const key = 'yolo';
    // const value = { data: true };
    // const store = new NodeJSStorage(':memory:', 'test-table');
    // await store.init();
    // await store.setItem(key, value);
    // const result = await store.getItem<typeof value>(key);
    // if (typeof result === 'undefined') throw new Error('result is undefined');
    // expect(result).toBeTruthy();
    // expect(result.data).toEqual(value.data);
  });
});
