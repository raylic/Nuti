// 测试用食物数据，参考 src/interface.d.ts 中的 Food 定义
// 使用 new URL(..., import.meta.url).href 来生成静态资源的可解析 URL（Vite 兼容）
export const foods = [
	{
		id: 'food_rice_001',
		name: '白米饭',
		icon: new URL('../assets/carb.svg', import.meta.url).href,
		nutrients: { carb: 28, protein: 2.7, fat: 0.3, calories: 130 },
		defaultWeight: 150,
	},
	{
		id: 'food_chicken_001',
		name: '鸡胸肉',
		icon: new URL('../assets/meat.svg', import.meta.url).href,
		nutrients: { carb: 0, protein: 31, fat: 3.6, calories: 165 },
		defaultWeight: 100,
	},
	{
		id: 'food_egg_001',
		name: '鸡蛋',
		icon: new URL('../assets/fat.svg', import.meta.url).href,
		nutrients: { carb: 0.6, protein: 13, fat: 11, calories: 155 },
		defaultWeight: 50,
	},
	{
		id: 'food_avocado_001',
		name: '牛油果',
		icon: new URL('../assets/fat.svg', import.meta.url).href,
		nutrients: { carb: 9, protein: 2, fat: 15, calories: 160 },
		defaultWeight: 100,
	},
	{
		id: 'food_almond_001',
		name: '杏仁',
		icon: new URL('../assets/fat.svg', import.meta.url).href,
		nutrients: { carb: 22, protein: 21, fat: 49, calories: 579 },
		defaultWeight: 28,
	},
	{
		id: 'food_broccoli_001',
		name: '西兰花',
		icon: new URL('../assets/carb.svg', import.meta.url).href,
		nutrients: { carb: 7, protein: 2.8, fat: 0.4, calories: 34 },
		defaultWeight: 100,
	},
	{
		id: 'food_oliveoil_001',
		name: '橄榄油',
		icon: new URL('../assets/fat.svg', import.meta.url).href,
		nutrients: { carb: 0, protein: 0, fat: 100, calories: 884 },
		defaultWeight: 15,
	},
	{
		id: 'food_apple_001',
		name: '苹果',
		icon: new URL('../assets/carb.svg', import.meta.url).href,
		nutrients: { carb: 14, protein: 0.3, fat: 0.2, calories: 52 },
		defaultWeight: 182,
	},
];

export default foods;
