import { create } from 'zustand';
import type { Food, Record } from "../interface.d";
import { foods as mockFoods } from '../mock';
import { saveToStorage, FOODS_KEY, RECORDS_KEY } from '../utils/storage';

// 获取今日日期字符串
const getTodayDate = () => new Date().toISOString().split('T')[0];

// Mock 初始记录数据（localStorage 为空时使用）
// const mockRecords: Record[] = [
//   {
//     id: '1',
//     content: {
//       id: 'food_banana_001',
//       name: '香蕉',
//       icon: '',
//       nutrients: { carb: 50, protein: 3, fat: 1, calories: 150 },
//       defaultWeight: 100,
//     },
//     eatTime: '08:00',
//     eatDate: getTodayDate(),
//   },
//   {
//     id: '2',
//     content: {
//       id: 'food_protein_001',
//       name: '蛋白粉',
//       icon: '',
//       nutrients: { carb: 5, protein: 30, fat: 2, calories: 150 },
//       defaultWeight: 30,
//     },
//     eatTime: '08:00',
//     eatDate: getTodayDate(),
//   },
//   {
//     id: '3',
//     content: {
//       id: 'food_lunch_001',
//       name: '午餐',
//       icon: '',
//       nutrients: { carb: 80, protein: 40, fat: 20, calories: 680 },
//       defaultWeight: 500,
//     },
//     eatTime: '12:30',
//     eatDate: getTodayDate(),
//   },
//   {
//     id: '4',
//     content: {
//       id: 'food_dinner_001',
//       name: '晚餐',
//       icon: '',
//       nutrients: { carb: 60, protein: 35, fat: 15, calories: 520 },
//       defaultWeight: 400,
//     },
//     eatTime: '18:30',
//     eatDate: getTodayDate(),
//   },
// ];

interface FoodState {
  foods: Food[];
  addFood: (food: Food) => void;
  removeFood: (id: string) => void;
  updateFood: (id: string, updatedFood: Partial<Food>) => void;
  getFoodById: (id: string) => Food | undefined;
  getAllFoods: () => Food[];
}

const useFoodStore = create<FoodState>((set, get) => ({
  foods: mockFoods,

  addFood: (food) => set((state) => ({
    foods: [food, ...state.foods]
  })),

  removeFood: (id) => set((state) => ({
    foods: state.foods.filter(food => food.id !== id)
  })),

  updateFood: (id, updatedFood) => set((state) => ({
    foods: state.foods.map(food =>
      food.id === id ? { ...food, ...updatedFood } : food
    )
  })),

  getFoodById: (id) => {
    const state = get();
    return state.foods.find(food => food.id === id);
  },

  getAllFoods: () => {
    const state = get();
    return state.foods;
  }
}));

// 食物变更自动写入 localStorage
useFoodStore.subscribe((state) => {
  saveToStorage(FOODS_KEY, state.foods);
});


interface RecordState {
    records: Record[];
    activeDate: string;
    setActiveDate: (date: string) => void;
    addRecord: (record: Record) => void;
    removeRecord: (id: string) => void;
    updateRecord: (id: string, updatedRecord: Partial<Record>) => void;
    getRecordById: (id: string) => Record | undefined;
    getAllRecords: () => Record[];
    getRecordsByDate: (date: string) => Record[];
    getRecordsByDateRange: (startDate: string, endDate: string) => Record[];
}

const useRecordStore = create<RecordState>((set, get) => ({
  records: [],
  activeDate: getTodayDate(),
  setActiveDate: (date) => set({ activeDate: date }),

  addRecord: (record) => set((state) => ({
    records: [...state.records, record]
  })),

  removeRecord: (id) => set((state) => ({
    records: state.records.filter(record => record.id !== id)
  })),

  updateRecord: (id, updatedRecord) => set((state) => ({
    records: state.records.map(record =>
      record.id === id ? { ...record, ...updatedRecord } : record
    )
  })),

  getRecordById: (id) => {
    const state = get();
    return state.records.find(record => record.id === id);
  },

  getAllRecords: () => {
    const state = get();
    return state.records;
  },

  getRecordsByDate: (date) => {
    const state = get();
    return state.records.filter(record => record.eatDate === date);
  },

  getRecordsByDateRange: (startDate, endDate) => {
    const state = get();
    return state.records.filter(record => {
      const recordDate = new Date(record.eatDate);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return recordDate >= start && recordDate <= end;
    });
  }
}));

// 记录变更自动写入 localStorage
useRecordStore.subscribe((state) => {
  saveToStorage(RECORDS_KEY, state.records);
});

export { useFoodStore, useRecordStore };
