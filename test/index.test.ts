import BrowserStorage from '../src/browser';
import ReactNativeStorage from '../src/react-native';
// import NodeJSStorage from '../src/node-js';

import MockAsyncStorage from './mock/asyncstorage';

const TEST_REACT_NATIVE_OPTIONS = {
  ['react-native']: {
    asyncStorage: new MockAsyncStorage(),
  },
};

// const TEST_NODE_JS_OPTIONS = {
//   ['node-js']: {
//     database: ":memory:",
//   },
// };

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
    const store = new ReactNativeStorage(TEST_REACT_NATIVE_OPTIONS);
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
    // const store = new NodeJSStorage(TEST_NODE_JS_OPTIONS);
    // await store.init();
    // await store.setItem(key, value);
    // const result = await store.getItem<typeof value>(key);
    // if (typeof result === 'undefined') throw new Error('result is undefined');
    // expect(result).toBeTruthy();
    // expect(result.data).toEqual(value.data);
  });
});
