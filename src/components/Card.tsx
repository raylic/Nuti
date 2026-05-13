import React from 'react';

export type CardProps = {
  title: React.ReactNode;
  subTitle?: React.ReactNode;
  content?: React.ReactNode;
  mark?: React.ReactNode;
  date?: string;
  position?: 'left' | 'right';
  className?: string;
  selected?: boolean;
  onClick?: () => void;
};

export const Card = ({ title, subTitle, content, mark, position = 'left', date, className, selected, onClick }: CardProps) => {
  return (
    <div onClick={onClick} className={`${onClick ? 'cursor-pointer' : ''} text-${position === 'left' ? 'right' : 'left'} ${position === 'right' ? 'ml-auto' : ''} ${className}`}>
        {date && <div className="text-sm text-[var(--gray-8)]">{date}</div>}
        <div className={`rounded-lg shadow-md px-2 py-1 ${selected ? 'bg-[var(--accent-a10)]' : 'bg-[var(--accent-a2)]'} `}>
            <div className={`flex flex-row${position === 'left' ? '-reverse' : ''} justify-between align-center gap-1`}>
              <div className={`text-lg ${selected ? 'text-[var(--accent-surface)]' : 'text-[var(--accent-a9)]'} font-semibold inline-block`}>{title}</div>
              <div className={`${selected ? 'text-[var(--accent-contrast)]' : 'text-[var(--accent-track)]'} font-bold leading-7`}>{content}</div>
            </div>
            <p className={`text-sm ${selected ? 'text-[var(--accent-4)]' : 'text-[var(--gray-8)]'}`}>{subTitle}</p>
            {mark && <p className="text-sm text-[var(--gray-indicator)] text-left">{mark}</p>}
        </div>
    </div>
);
};
