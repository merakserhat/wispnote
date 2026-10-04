import { STORAGE_KEYS } from './storage.constants';

export type TStorageKeys = STORAGE_KEYS;

export type TStorage = {
  readStorage: (key: TStorageKeys) => string | null;
  writeStorage: (key: TStorageKeys, data: string) => void;
  writeStorageFromKeys: (keyValuePairs: Partial<Record<TStorageKeys, string>>) => void;
  removeStorage: (key: TStorageKeys) => void;
  removeStorageFromKeys: (keys: TStorageKeys[]) => void;
  removeTokens: () => void;
};
