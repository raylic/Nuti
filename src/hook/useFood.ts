import { useCallback } from 'react';
import useFoodStore from '../store';
import type { Food } from '../interface.d';

// 自定义 hook，提供更方便的食物管理功能
const useFood = () => {
  const { foods, addFood, removeFood, updateFood, getFoodById, getAllFoods } = useFoodStore();

  // 添加食物
  const handleAddFood = useCallback((food: Omit<Food, 'id'> | Food) => {
    // 确保食物有唯一 ID
    const foodWithId = {
      ...food,
      id: food.id || `food-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    addFood(foodWithId);
    return foodWithId;
  }, [addFood]);

  // 删除食物
  const handleRemoveFood = useCallback((id: string) => {
    removeFood(id);
  }, [removeFood]);

  // 更新食物
  const handleUpdateFood = useCallback((id: string, updatedFood: Partial<Food>) => {
    updateFood(id, updatedFood);
  }, [updateFood]);

  // 获取单个食物
  const handleGetFoodById = useCallback((id: string) => {
    return getFoodById(id);
  }, [getFoodById]);

  // 获取所有食物
  const handleGetAllFoods = useCallback(() => {
    return getAllFoods();
  }, [getAllFoods]);

  // 按名称搜索食物
  const searchFoodsByName = useCallback((name: string) => {
    const allFoods = getAllFoods();
    if (!name.trim()) return allFoods;
    return allFoods.filter(food => 
      food.name.toLowerCase().includes(name.toLowerCase())
    );
  }, [getAllFoods]);

  return {
    foods,
    addFood: handleAddFood,
    removeFood: handleRemoveFood,
    updateFood: handleUpdateFood,
    getFoodById: handleGetFoodById,
    getAllFoods: handleGetAllFoods,
    searchFoodsByName
  };
};

export default useFood;