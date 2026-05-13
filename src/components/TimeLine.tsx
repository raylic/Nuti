import React from 'react';
import { Theme } from '@radix-ui/themes';
import * as Dialog from '@radix-ui/react-dialog';
import { Card } from './Card';
import type { CardProps } from './Card';
import { useRecordStore } from '../store';
import type { Record, Food, Combo } from '../interface';
import { themeConfig } from '../utils';

const TimelineItem = ({ position, ...props }: CardProps) => {
  const isLeft = position === 'left';

  return (
    <div className="relative flex items-center justify-between max-w-[500px] mx-auto">
      <Card
        {...props}
        position={position}
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

function DetailDialog({
  record,
  open,
  onOpenChange,
}: {
  record: Record | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!record) return null;

  const content = record.content;
  const foods: Food[] = 'foods' in content ? (content as Combo).foods : [content as Food];
  const nutrients = content.nutrients;
  const notice = 'notice' in content ? (content as Combo).notice : '';

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Theme accentColor={themeConfig.accentColor}>
          <Dialog.Content
            aria-label={content.name}
            className="fixed top-1/2 left-1/2 w-[90%] max-w-md max-h-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg bg-white overflow-auto"
          >
            <div className="p-5 flex flex-col gap-3">
              {/* 标题行 */}
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-[var(--accent-a11)]">{content.name}</h2>
                <span className="ml-auto text-sm text-[var(--gray-8)]">{record.eatTime}</span>
              </div>

              {notice && (
                <p className="text-sm text-[var(--gray-8)]">备注：{notice}</p>
              )}

              {/* 食物列表 */}
              <div className="flex flex-col gap-2">
                {foods.map((food) => (
                  <Card
                    key={food.id}
                    title={food.name}
                    subTitle={`${food.nutrients.carb.toFixed(0)}g|${food.nutrients.protein.toFixed(0)}g|${food.nutrients.fat.toFixed(0)}g${food.weight ? `  ${food.weight}g` : ''}`}
                    content={`${food.nutrients.calories}卡`}
                  />
                ))}
              </div>

              {/* 合计 */}
              <div className="text-sm text-[var(--accent-a11)] text-right border-t border-[var(--accent-a5)] pt-2">
                合计 {nutrients.carb.toFixed(0)}g|{nutrients.protein.toFixed(0)}g|{nutrients.fat.toFixed(0)}g {nutrients.calories.toFixed(0)}卡
              </div>
            </div>
          </Dialog.Content>
        </Theme>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const Timeline = () => {
  const records = useRecordStore((state) => state.records);
  const [selectedRecord, setSelectedRecord] = React.useState<Record | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleRecordClick = (record: Record) => {
    setSelectedRecord(record);
    setDialogOpen(true);
  };

  return (
    <div className="relative h-full">
      {records.slice().reverse().map((record, index) => {
        const food = record.content;
        const nutrients = food.nutrients;
        const subTitle = `${nutrients.carb.toFixed(0)}g|${nutrients.protein.toFixed(0)}g|${nutrients.fat.toFixed(0)}g`;
        const content = `${nutrients.calories}`;

        return (
          <TimelineItem
            key={record.id}
            position={index % 2 === 0 ? 'left' : 'right'}
            title={food.name}
            subTitle={subTitle}
            content={content}
            date={record.eatTime}
            onClick={() => handleRecordClick(record)}
          />
        );
      })}

      <DetailDialog
        record={selectedRecord}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default Timeline;
