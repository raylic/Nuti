// 重量单位类型
type WeightUnit = '克' | '千克' | '斤' | '两' | '份' | string;

// 单个食物
export interface Food {
  // 唯一标识
  id: string;
  // 食物名称
  name: string;
  // 图标/图片URL
  icon: string;
  // 每100克重量的营养成分
  nutrients: {
    // 碳水化合物 (克)
    carb: number;
    // 蛋白质 (克)
    protein: number;
    // 脂肪 (克)
    fat: number;
    // 总热量 (千卡)
    calories: number;
  };
  // 默认一份重量，单位克
  defaultWeight: number;
  // 实际重量值
  weight?: number;
}

// 套餐
export interface Combo {
  // 唯一标识
  id: string;
  // 名称
  name: string;
  // icon
  icon: string;
  // 具体包含食物
  foods: Array<Food>;
  // 缓存实际营养成分
  nutrients: {
    // 碳水化合物 (克)
    carb: number;
    // 蛋白质 (克)
    protein: number;
    // 脂肪 (克)
    fat: number;
    // 总热量 (千卡)
    calories: number;
  };
  // 备注
  notice: string;
}

export interface Record {
  // 唯一标识
  id: string;
  // 一次一个食物包
  content: Combo | Food;
  // 吃饭时间，主要用来确定日期
  eatTime: string;
  // 分组用
  eatDate: string;
}

interface RecordsPageData {
   records: Record[];
   combo: Combos[];
   foods: Foods[];
}