import { app, safeStorage } from 'electron';
import fs from 'fs';
import path from 'path';

import { log } from '../log.helpers';
import { STORAGE_FILE, STORAGE_KEYS } from './storage.constants';
import { TStorage, TStorageKeys } from './storage.types';

type TStorageContent = Partial<Record<TStorageKeys, string>>;

let content: TStorageContent | null = null;

function getFilePath(): string {
  return path.join(app.getPath('userData'), STORAGE_FILE);
}

function read(): TStorageContent {
  try {
    if (fs.existsSync(getFilePath()) && safeStorage.isEncryptionAvailable()) {
      return JSON.parse(safeStorage.decryptString(fs.readFileSync(getFilePath())));
    }
  } catch (error) {
    log('error', `could not read storage: ${String(error)}`);
  }

  return {};
}

function load(): TStorageContent {
  if (!content) {
    content = read();
  }

  return content;
}

function persist(): void {
  try {
    if (!safeStorage.isEncryptionAvailable()) {
      log('auth', 'no encryption available, tokens are kept in memory only');
      return;
    }

    fs.writeFileSync(getFilePath(), safeStorage.encryptString(JSON.stringify(load())));
  } catch (error) {
    log('error', `could not persist storage: ${String(error)}`);
  }
}

function readStorage(key: TStorageKeys): string | null {
  return load()[key] ?? null;
}

function writeStorage(key: TStorageKeys, data: string): void {
  load()[key] = data;
  persist();
}

function writeStorageFromKeys(keyValuePairs: Partial<Record<TStorageKeys, string>>): void {
  Object.entries(keyValuePairs).forEach(function writeEach([key, value]) {
    load()[key as TStorageKeys] = value as string;
  });
  persist();
}

function removeStorage(key: TStorageKeys): void {
  delete load()[key];
  persist();
}

function removeStorageFromKeys(keys: TStorageKeys[]): void {
  keys.forEach(function removeEach(key) {
    delete load()[key];
  });
  persist();
}

function removeTokens(): void {
  removeStorageFromKeys([STORAGE_KEYS.ACCESS_TOKEN, STORAGE_KEYS.REFRESH_TOKEN]);
}

const storage: TStorage = {
  readStorage,
  writeStorage,
  writeStorageFromKeys,
  removeStorage,
  removeStorageFromKeys,
  removeTokens,
};

export default storage;
