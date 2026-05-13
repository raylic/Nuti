import { useRecordStore } from '../store';
import type { Record } from '../interface';

const getToday = () => new Date().toISOString().split('T')[0];

function buildMockRecords(date: string): Record[] {
  return [
    {
      id: `debug-1-${date}`,
      content: {
        id: 'food_banana_001',
        name: '香蕉',
        icon: '',
        nutrients: { carb: 50, protein: 3, fat: 1, calories: 150 },
        defaultWeight: 100,
      },
      eatTime: '08:00',
      eatDate: date,
    },
    {
      id: `debug-2-${date}`,
      content: {
        id: 'food_protein_001',
        name: '蛋白粉',
        icon: '',
        nutrients: { carb: 5, protein: 30, fat: 2, calories: 150 },
        defaultWeight: 30,
      },
      eatTime: '08:00',
      eatDate: date,
    },
    {
      id: `debug-3-${date}`,
      content: {
        id: 'combo-debug',
        name: '午餐',
        icon: '',
        foods: [
          {
            id: `food_chicken_debug-${date}`,
            name: '鸡胸肉',
            icon: '',
            nutrients: { carb: 0, protein: 124, fat: 14.4, calories: 660 },
            defaultWeight: 100,
            weight: 400,
          },
          {
            id: `food_rice_debug-${date}`,
            name: '白米饭',
            icon: '',
            nutrients: { carb: 42, protein: 4.1, fat: 0.5, calories: 195 },
            defaultWeight: 150,
            weight: 150,
          },
        ],
        nutrients: { carb: 42, protein: 128.1, fat: 14.9, calories: 855 },
        notice: '训练后餐',
      },
      eatTime: '12:30',
      eatDate: date,
    },
    {
      id: `debug-4-${date}`,
      content: {
        id: 'food_dinner_001',
        name: '晚餐',
        icon: '',
        nutrients: { carb: 60, protein: 35, fat: 15, calories: 520 },
        defaultWeight: 400,
      },
      eatTime: '18:30',
      eatDate: date,
    },
  ];
}

/** 调试：往 store 中塞入 mock 记录。date 参数可选，默认今天，格式 'YYYY-MM-DD' */
export function seedRecords(date?: string) {
  const { addRecord } = useRecordStore.getState();
  const targetDate = date || getToday();
  buildMockRecords(targetDate).forEach((r) => addRecord(r));
}

/** 调试：清除所有记录 */
export function clearRecords() {
  const { records } = useRecordStore.getState();
  records.forEach((r) => useRecordStore.getState().removeRecord(r.id));
}

// 挂载到 window 方便在浏览器控制台调用
if (typeof window !== 'undefined') {
  (window as any).__nuti = {
    seedRecords,
    clearRecords,
  };
}
