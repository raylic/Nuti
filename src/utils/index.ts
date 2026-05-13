// 主题配置
// const accentColors = ['gray', 'gold', 'bronze', 'brown', 'yellow', 'amber', 'orange', 'tomato', 'red', 'ruby', 'crimson', 'pink', 'plum', 'purple', 'violet', 'iris', 'indigo', 'blue', 'cyan', 'teal', 'jade', 'green', 'grass', 'lime', 'mint', 'sky'] as const;
export const themeConfig = {
  accentColor: 'ruby' as const,
};

// 通过碳水 蛋白质 脂肪 计算总热量

/**
 * 根据碳水、脂肪、蛋白质克数计算总卡路里（千卡）
 * @param carbs 碳水化合物克数（g）
 * @param fats 脂肪克数（g）
 * @param proteins 蛋白质克数（g）
 * @returns 总卡路里（千卡），保留2位小数
 * @throws 当输入为负数或非数字时抛出错误
 */
export function calculateCalories(
  carbs: number,
  fats: number,
  proteins: number
): number {
  // 校验输入是否为有效数字
  const validateNumber = (value: number, name: string) => {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error(`${name}必须是有效的数字`);
    }
    if (value < 0) {
      throw new Error(`${name}不能为负数`);
    }
  };

  // 校验三个参数的合法性
  validateNumber(carbs, '碳水化合物');
  validateNumber(fats, '脂肪');
  validateNumber(proteins, '蛋白质');

  // 三大营养素热量系数（添加小数点，明确为浮点型）
  const CARBS_CAL_PER_GRAM = 4.0; // 碳水：4.0千卡/克
  const FATS_CAL_PER_GRAM = 9.0;  // 脂肪：9.0千卡/克
  const PROTEINS_CAL_PER_GRAM = 4.0; // 蛋白质：4.0千卡/克

  // 计算各营养素的热量并求和
  const carbsCalories = carbs * CARBS_CAL_PER_GRAM;
  const fatsCalories = fats * FATS_CAL_PER_GRAM;
  const proteinsCalories = proteins * PROTEINS_CAL_PER_GRAM;
  const totalCalories = carbsCalories + fatsCalories + proteinsCalories;

  // 保留2位小数，避免浮点运算精度问题
  return Math.round(totalCalories * 100) / 100;
}