import React from 'react';

import carb from '../assets/carb.svg';
import fat from '../assets/fat.svg';
import meat from '../assets/meat.svg';

export default function ThreeColumns() {
  const items = [
    { img: carb, title: '160g', desc: '碳水' },
    { img: meat, title: '50g', desc: '蛋白质' },
    { img: fat, title: '50g', desc: '脂肪' },
  ];

  return (
    <div className="flex flex-row justify-center items-start p-6 gap-6 bg-[var(--accent-track)] rounded-lg shadow-md">
      {items.map((it) => (
        <div key={it.title} className="flex flex-col items-center text-center">
          <img src={it.img} alt={it.title} className="h-12 w-12 mb-2 bg-[var(--accent-surface)] rounded-full p-2" />
          <div className="text-sm">
            <div className="font-medium text-[var(--accent-contrast)]">{it.title}</div>
            <div className="text-[var(--accent-contrast)] opacity-50 text-xs">{it.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
