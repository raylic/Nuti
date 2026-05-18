import React from 'react';
import { Theme } from '@radix-ui/themes';
import * as Dialog from '@radix-ui/react-dialog';
import { Card } from './Card';
import type { CardProps } from './Card';
import { useRecordStore } from '../store';
import type { Record, Food, Combo } from '../interface';
import { themeConfig } from '../utils';
import AddRecordDialog from './AddRecordDialog';

const TimelineItem = ({ position, onContextMenu, ...props }: CardProps & { onContextMenu?: (e: React.MouseEvent) => void }) => {
  return (
    <div className="relative flex items-center justify-between max-w-[500px] mx-auto" onContextMenu={onContextMenu}>
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
  onCopy,
  onEdit,
  onDelete,
}: {
  record: Record | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  onCopy: () => void;
}) {
  if (!record) return null;

  const content = record.content;
  const foods: Food[] = 'foods' in content ? (content as Combo).foods : [content as Food];
  const nutrients = content.nutrients;
  const notice = 'notice' in content ? (content as Combo).notice : '';
  const [confirmingDelete, setConfirmingDelete] = React.useState(false);

  React.useEffect(() => {
    if (!open) setConfirmingDelete(false);
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Theme accentColor={themeConfig.accentColor} appearance={themeConfig.appearance}>
          <Dialog.Content
            aria-label={content.name}
            className="fixed top-1/2 left-1/2 w-[90%] max-w-md max-h-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg bg-white overflow-auto"
          >
            <div className="p-5 flex flex-col gap-3">
              {/* 标题行 */}
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-[var(--accent-a11)]">{content.name}</h2>
                <div onClick={onCopy} className="ml-auto text-sm text-[var(--accent-a9)] hover:text-[var(--accent-a11)]">复制</div>
                <div onClick={onEdit} className="text-sm text-[var(--accent-a9)] hover:text-[var(--accent-a11)]">编辑</div>
                {confirmingDelete ? (
                  <div className="flex gap-1 items-center">
                    <div onClick={() => { onDelete(); setConfirmingDelete(false); }} className="text-sm bg-red-500 text-white rounded px-2 py-0.5 hover:bg-red-600 transition-colors">是</div>
                    <div onClick={() => setConfirmingDelete(false)} className="text-sm bg-[var(--accent-a3)] text-[var(--accent-a11)] rounded px-2 py-0.5">否</div>
                  </div>
                ) : (
                  <div onClick={() => setConfirmingDelete(true)} className="text-sm bg-red-500 text-white rounded px-2 py-1 hover:bg-red-600 transition-colors">删除</div>
                )}
              </div>

              {notice && (
                <p className="text-sm text-[var(--gray-8)]">备注：{notice}</p>
              )}

              {/* 食物列表 */}
              <div className="flex flex-col gap-2">
                {foods.map((food) => (
                  <Card
                    key={food.id}
                    title={`${food.name}${food.weight ? `  ${food.weight}g` : ''}`}
                    subTitle={`${food.nutrients.carb.toFixed(0)}g|${food.nutrients.protein.toFixed(0)}g|${food.nutrients.fat.toFixed(0)}g`}
                    content={`${Math.round(food.nutrients.calories)}卡`}
                  />
                ))}
              </div>

              {/* 合计 */}
              <div className="flex justify-between items-center text-sm border-t border-[var(--accent-a5)] pt-2">
                <span className="text-[var(--gray-8)]">{record.eatTime}</span>
                <span className="text-[var(--accent-a11)]">
                  合计 {nutrients.carb.toFixed(0)}g|{nutrients.protein.toFixed(0)}g|{nutrients.fat.toFixed(0)}g {nutrients.calories.toFixed(0)}卡
                </span>
              </div>
            </div>
          </Dialog.Content>
        </Theme>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ContextMenu({
  position,
  onClose,
  onCopy,
  onEdit,
  onDelete,
}: {
  record: Record;
  position: 'left' | 'right';
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCopy: () => void;
}) {
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [confirmingDelete, setConfirmingDelete] = React.useState(false);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
        setConfirmingDelete(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className={`absolute top-1/2 -translate-y-1/2 z-20 bg-white rounded-lg shadow-lg border border-[var(--accent-a5)] overflow-hidden transition-all duration-200 scale-100 opacity-100 flex flex-row ${
        position === 'left' ? 'left-[calc(50%+1rem)]' : 'right-[calc(50%+1rem)]'
      }`}
    >
      <div
        onClick={onCopy}
        className="px-2 py-1 text-center text-sm text-[var(--accent-a11)] hover:bg-[var(--accent-a3)] transition-colors whitespace-nowrap"
      >
        复制
      </div>
      <div
        onClick={onEdit}
        className="px-2 py-1 text-center text-sm text-[var(--accent-a11)] hover:bg-[var(--accent-a3)] transition-colors whitespace-nowrap"
      >
        编辑
      </div>
      {confirmingDelete ? (
        <div className="flex items-center gap-1 px-2 py-1 whitespace-nowrap">
          <div className="flex gap-1">
            <div
              onClick={() => { onDelete(); setConfirmingDelete(false); }}
              className="px-1.5 py-0.5 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              是
            </div>
            <div
              onClick={() => setConfirmingDelete(false)}
              className="px-1.5 py-0.5 text-xs bg-[var(--accent-a3)] text-[var(--accent-a11)] rounded"
            >
              否
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setConfirmingDelete(true)}
          className="px-2 py-1 text-center text-sm bg-red-500 text-white hover:bg-red-600 transition-colors whitespace-nowrap"
        >
          删除
        </div>
      )}
    </div>
  );
}

const Timeline = () => {
  const records = useRecordStore((state) => state.records);
  const setActiveDate = useRecordStore((state) => state.setActiveDate);
  const removeRecord = useRecordStore((state) => state.removeRecord);
  const [selectedRecord, setSelectedRecord] = React.useState<Record | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [menuRecord, setMenuRecord] = React.useState<{ record: Record; position: 'left' | 'right' } | null>(null);
  const [editRecord, setEditRecord] = React.useState<Record | null>(null);
  const [editOpen, setEditOpen] = React.useState(false);
  const [copyRecord, setCopyRecord] = React.useState<Record | null>(null);

  // 滚动时检测当前可见日期，联动顶部数据
  React.useEffect(() => {
    const sentinels = document.querySelectorAll('[data-date]');
    if (sentinels.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveDate((visible[0].target as HTMLElement).dataset.date!);
        }
      },
      { rootMargin: '-10% 0px -70% 0px' }
    );
    sentinels.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [records, setActiveDate]);

  const handleRecordClick = (record: Record) => {
    setSelectedRecord(record);
    setDialogOpen(true);
  };

  const handleContextMenu = (e: React.MouseEvent, record: Record, position: 'left' | 'right') => {
    e.preventDefault();
    setMenuRecord({ record, position });
  };

  return (
    <div className="relative h-full">
      {records.length === 0 ? (
        <div className="flex items-center justify-center h-full text-sm text-[var(--gray-8)]">
          暂无记录，点击下方 + 按钮添加
        </div>
      ) : (
        records.map((record, index) => {
        const food = record.content;
        const nutrients = food.nutrients;
        const subTitle = `${nutrients.carb.toFixed(0)}g|${nutrients.protein.toFixed(0)}g|${nutrients.fat.toFixed(0)}g`;
        const content = `${Math.round(nutrients.calories)}`;
        const position = index % 2 === 0 ? 'left' as const : 'right' as const;

        // 日期分割：新日期首次出现时展示日期+时间，后续只展示时间
        const prevRecord = index > 0 ? records[index - 1] : null;
        const showDate = !prevRecord || record.eatDate !== prevRecord.eatDate;
        const dateLabel = showDate ? `${record.eatDate.slice(5)} ${record.eatTime}` : record.eatTime;

        return (
          <div key={record.id} className="relative" data-date={showDate ? record.eatDate : undefined}>
            <TimelineItem
              position={position}
              title={food.name}
              subTitle={subTitle}
              content={content}
              date={dateLabel}
              onClick={() => handleRecordClick(record)}
              onContextMenu={(e) => handleContextMenu(e, record, position)}
            />

            {/* 长按菜单 */}
            {menuRecord && menuRecord.record.id === record.id && (
              <ContextMenu
                record={menuRecord.record}
                position={menuRecord.position}
                onClose={() => setMenuRecord(null)}
                onCopy={() => {
                  setCopyRecord(menuRecord.record);
                  setEditOpen(true);
                  setMenuRecord(null);
                }}
                onEdit={() => {
                  setEditRecord(menuRecord.record);
                  setEditOpen(true);
                  setMenuRecord(null);
                }}
                onDelete={() => {
                  removeRecord(menuRecord.record.id);
                  setMenuRecord(null);
                }}
              />
            )}
          </div>
        );
      }))}
      <div className='h-20' />
      <DetailDialog
        record={selectedRecord}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCopy={() => {
          setCopyRecord(selectedRecord);
          setEditOpen(true);
          setDialogOpen(false);
        }}
        onEdit={() => {
          setEditRecord(selectedRecord);
          setEditOpen(true);
          setDialogOpen(false);
        }}
        onDelete={() => {
          if (selectedRecord) removeRecord(selectedRecord.id);
          setDialogOpen(false);
        }}
      />

      <AddRecordDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) { setCopyRecord(null); setEditRecord(null); }
        }}
        editRecord={editRecord || undefined}
        copyRecord={copyRecord || undefined}
      />
    </div>
  );
};

export default Timeline;
