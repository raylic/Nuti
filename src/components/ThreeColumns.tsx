import React from 'react';

import carb from '../assets/carb.svg';
import fat from '../assets/fat.svg';
import meat from '../assets/meat.svg';
import { useRecordStore } from '../store';
import AnimatedNumber from './AnimatedNumber';

export default function ThreeColumns() {
  const records = useRecordStore((state) => state.records);
  const activeDate = useRecordStore((state) => state.activeDate);

  // 计算当前日期营养素总量
  const dateNutrients = React.useMemo(() => {
    const dateRecords = records.filter((r) => r.eatDate === activeDate);

    return dateRecords.reduce(
      (acc, record) => {
        const nutrients = record.content.nutrients;
        return {
          carb: acc.carb + nutrients.carb,
          protein: acc.protein + nutrients.protein,
          fat: acc.fat + nutrients.fat,
          calories: acc.calories + nutrients.calories,
        };
      },
      { carb: 0, protein: 0, fat: 0, calories: 0 }
    );
  }, [records, activeDate]);

  const items = [
    { img: carb, value: Math.round(dateNutrients.carb), suffix: 'g', desc: '碳水' },
    { img: meat, value: Math.round(dateNutrients.protein), suffix: 'g', desc: '蛋白质' },
    { img: fat, value: Math.round(dateNutrients.fat), suffix: 'g', desc: '脂肪' },
  ];

  return (
    <div className="flex flex-row justify-center items-start p-6 gap-6 bg-[var(--accent-track)] rounded-lg shadow-md">
      {items.map((it) => (
        <div key={it.desc} className="flex flex-col items-center text-center">
          <img src={it.img} alt={it.desc} className="h-12 w-12 mb-2 bg-[var(--accent-surface)] rounded-full p-2" />
          <div className="text-sm">
            <div className="font-medium text-[var(--accent-contrast)]"><AnimatedNumber value={it.value} />{it.suffix}</div>
            <div className="text-[var(--accent-contrast)] opacity-50 text-xs">{it.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
