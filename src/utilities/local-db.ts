import { ShiftNbDomainType } from '@/components';

const DB_NAME = 'BigCacheDB';
const STORE_NAME = 'cacheStore';
const DB_VERSION = 1;
const IMAGE_SRC = 'image-src-detection-shift';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveBigCache<T = any>(key: string, value: T): Promise<boolean> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(value, key);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

async function getBigCache<T = any>(key: string): Promise<T | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(key);

    request.onsuccess = () => resolve(request.result as T | undefined);
    request.onerror = () => reject(request.error);
  });
}

const getImageName = (shiftNb: ShiftNbDomainType) => `${IMAGE_SRC}-${shiftNb.x}-${shiftNb.y}`;

const setImageSrc = async (imgSrc: string, shiftNb: ShiftNbDomainType) => {
  const existingData = await getBigCache<string>(getImageName(shiftNb));
  if (existingData) {
    return true;
  }
  return await saveBigCache(getImageName(shiftNb), imgSrc);
};

const getImageSrc = async (shiftNb: ShiftNbDomainType) => {
  return await getBigCache<string>(getImageName(shiftNb));
};

/**
 * @name localDb
 * @description This is a group of functions that store data which may be large in size locally.
 */
export const localDb = {
  setImageSrc,
  getImageSrc,
};
