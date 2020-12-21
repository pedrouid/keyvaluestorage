import { safeJsonParse } from 'safe-json-utils';
import {
  KeyValueStorageOptions,
  KeyValueStorageOptionsNodeJS,
  KeyValueStorageOptionsReactNative,
  NodeJSStorageOptions,
  ReactNativeStorageOptions,
} from './types';

export const REACT_NATIVE_OPTIONS_KEY = 'react-native';

export function isReactNativeOptions(
  opts: KeyValueStorageOptions
): opts is KeyValueStorageOptionsReactNative {
  return REACT_NATIVE_OPTIONS_KEY in opts;
}

export function getReactNativeOptions(
  opts?: KeyValueStorageOptions
): ReactNativeStorageOptions {
  if (typeof opts === 'undefined' || !isReactNativeOptions(opts)) {
    throw new Error(
      'Missing KeyValueStorage options required for React-Native'
    );
  }
  return opts[REACT_NATIVE_OPTIONS_KEY];
}

export const NODE_JS_OPTIONS_KEY = 'node-js';

export function isNodeJSOptions(
  opts: KeyValueStorageOptions
): opts is KeyValueStorageOptionsNodeJS {
  return NODE_JS_OPTIONS_KEY in opts;
}

export function getNodeJSOptions(
  opts?: KeyValueStorageOptions
): NodeJSStorageOptions {
  if (typeof opts === 'undefined' || !isNodeJSOptions(opts)) {
    throw new Error('Missing KeyValueStorage options required for NodeJS');
  }
  return opts[NODE_JS_OPTIONS_KEY];
}

export function parseEntry(entry: [string, string]): [string, any] {
  return [entry[0], safeJsonParse(entry[1])];
}
