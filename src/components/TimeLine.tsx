import { Card } from './Combo';
import type { CardProps } from './Combo';
import { useRecordStore } from '../store';

const TimelineItem = ({ position, ...props }: CardProps) => {
  const isLeft = position === 'left';

  return (
    <div className="relative flex items-center justify-between max-w-[500px] mx-auto">
      {/* 食物卡片 */}
      <Card
        {...props}
        position={position}
        className='w-[calc(50%-1.5rem)]'
      />

      {/* 时间 - 在对侧 */}
      {/* <div className={`absolute ${isLeft ? 'left-[calc(50%+1.5rem)]' : 'left-0'} w-[calc(50%-1.5rem)] text-${isLeft ? 'left' : 'right'} text-sm text-[var(--gray-8)] px-2`}>
        {props.date}
      </div> */}

      {/* 中间时间线 */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-[var(--accent-7)] opacity-80">
        <div className="flex align-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-4 border-solid border-[var(--accent-7)] bg-white">
        </div>
      </div>
    </div>
  );
};

const Timeline = () => {
  const records = useRecordStore((state) => state.records);

  return (
    <div className="relative h-full">
      {records.map((record, index) => {
        const food = record.content;
        const nutrients = food.nutrients;
        const subTitle = `${nutrients.carb}g|${nutrients.protein}g|${nutrients.fat}g`;
        const content = `${nutrients.calories}`;

        return (
          <TimelineItem
            key={record.id}
            position={index % 2 === 0 ? 'left' : 'right'}
            title={food.name}
            subTitle={subTitle}
            content={content}
            date={record.eatTime}
          />
        );
      })}
      {/* 空白区域的竖线 */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-1/2 bottom-0 bg-[var(--accent-7)] opacity-80"></div>
    </div>
  );
};

export default Timeline;