import { create } from 'zustand';
import type { Food, Record } from "../interface.d";

interface FoodState {
  foods: Food[];
  addFood: (food: Food) => void;
  removeFood: (id: string) => void;
  updateFood: (id: string, updatedFood: Partial<Food>) => void;
  getFoodById: (id: string) => Food | undefined;
  getAllFoods: () => Food[];
}

const useFoodStore = create<FoodState>((set, get) => ({
  foods: [],
  
  addFood: (food) => set((state) => ({
    foods: [...state.foods, food]
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


interface RecordState {
    records: Record[];
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

export { useFoodStore, useRecordStore };
