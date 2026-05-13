import React from 'react';
import { PlusIcon } from "@radix-ui/react-icons"
import EditFoodDialog from './EditFoodDialog';
import AddRecordDialog from './AddRecordDialog';
type Props = {
  mainLabel?: string;
  leftLabel?: string;
  rightLabel?: string;
  onMainClick?: () => void;
  onLeftClick?: () => void;
  onRightClick?: () => void;
};

export default function BottomActions({
  onMainClick,
  onLeftClick,
  onRightClick,
}: Props) {
  const [isAddRecordDialogOpen, setIsAddRecordDialogOpen] = React.useState(false);

  return (
    <>
      <AddRecordDialog open={isAddRecordDialogOpen} onOpenChange={setIsAddRecordDialogOpen} />
      <div className="fixed left-0 right-0 bottom-4 pointer-events-none">
        <div className="relative w-full max-w-4xl mx-auto px-4">
          {/* <div
            onClick={onMainClick}
            className="pointer-events-auto absolute left-1/2 -translate-x-1/2 px-6 py-3 rounded-full text-white font-semibold shadow-lg bg-[var(--gray-2)] h-12 w-40 bottom-2 flex items-center justify-center"
          >
          </div> */}

          <div
            className="pointer-events-auto absolute left-1/2 -translate-x-1/2 bottom-0 rounded-full text-white font-semibold shadow-lg bg-[var(--accent-track)] h-16 w-16 flex items-center justify-center border-3 border-[var(--accent-surface)]"
            onClick={() => setIsAddRecordDialogOpen(true)}
          >
              <PlusIcon color={'var(--accent-surface)'} className='w-6 h-6' />
          </div>
        </div>
      </div>
    </>
  );
}
