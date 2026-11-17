export type SavedSpot = {
  id: string;
  createdAt: number;
  product: string;
  era: string;
  eraYear: string;
  text: string;
  blob: Blob;
};

const DB_NAME = 'dploy-library';
const STORE = 'spots';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'id' });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = fn(db.transaction(STORE, mode).objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveSpot(spot: Omit<SavedSpot, 'id' | 'createdAt'>): Promise<void> {
  const entry: SavedSpot = { ...spot, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, createdAt: Date.now() };
  await run('readwrite', (s) => s.put(entry));
}

export async function listSpots(): Promise<SavedSpot[]> {
  const all = await run('readonly', (s) => s.getAll() as IDBRequest<SavedSpot[]>);
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

export async function deleteSpot(id: string): Promise<void> {
  await run('readwrite', (s) => s.delete(id));
}
