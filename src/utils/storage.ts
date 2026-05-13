const FOODS_KEY = 'nuti-foods';
const RECORDS_KEY = 'nuti-records';

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
  }
  return fallback;
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    /* quota exceeded etc */
  }
}

export { FOODS_KEY, RECORDS_KEY };
