import React from 'react';
import { Card } from './Combo'; 
import type { CardProps } from './Combo';

const TimelineItem = (props: CardProps & { date?: string; type: string }) => {
  return (
    <div className="relative flex items-center justify-between max-w-[500px] mx-auto">
      {/* 时间 */}
      <Card
        {...props}
        className='w-[calc(50%-1.5rem)]'
      />
      {/* 中间时间线 */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-[var(--accent-7)] opacity-80">
        <div className="flex align-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-4 border-solid border-[var(--accent-7)] bg-white">
        </div>
      </div>
    </div>
  );
};

const Timeline = () => {
  const timelineData = [
    { title: '日常早餐', subTitle: '50g|30g|20g', content: '150', mark: '一根香蕉一杯蛋白粉一瓶饮料', date: '2026-02-25' },
    { title: '日常早餐', subTitle: '50g|30g|20g', content: '150', mark: '一根香蕉一杯蛋白粉一瓶饮料' },
    { title: '日常早餐', subTitle: '50g|30g|20g', content: '150', mark: '一根香蕉一杯蛋白粉一瓶饮料' },
    { title: '日常早餐', subTitle: '50g|30g|20g', content: '150', mark: '一根香蕉一杯蛋白粉一瓶饮料' },
    { title: '午餐', subTitle: '50g|30g|20g', content: '123', date: '2026-02-25' },
    { title: '锻炼', subTitle: '50g|30g|20g', content: '', date: '2026-02-25' },
    { title: '加餐', subTitle: '50g|30g|20g', content: '' },
    { title: '午餐', subTitle: '50g|30g|20g', content: '' },
    { title: '晚餐', subTitle: '50g|30g|20g', content: '' },
  ];

  return (
    <div>
      {timelineData.map((item, index) => (
        <TimelineItem
          key={index}
          position={index % 2 === 0 ? 'left' : 'right'} // 根据索引交替显示左右
          // icon={item.icon}
          date={item.date}
          title={item.title}
          subTitle={item.subTitle}
          content={item.content}
          mark={item.mark}
        />
      ))}
    </div>
  );
};

export default Timeline;