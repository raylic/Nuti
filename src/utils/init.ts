import { useFoodStore, useRecordStore } from '../store';
import { foods as mockFoods } from '../mock';
import { loadFromStorage, FOODS_KEY, RECORDS_KEY } from './storage';
import type { Record } from '../interface';

export function initApp() {
  useFoodStore.setState({ foods: loadFromStorage(FOODS_KEY, mockFoods) });

  const records = loadFromStorage<Record[]>(RECORDS_KEY, []);
  // 按吃饭时间倒序排列（最新在前）
  records.sort((a, b) => {
    const dateDiff = b.eatDate.localeCompare(a.eatDate);
    if (dateDiff !== 0) return dateDiff;
    return b.eatTime.localeCompare(a.eatTime);
  });
  useRecordStore.setState({ records });
}
