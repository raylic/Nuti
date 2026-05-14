import React from 'react'
import { Theme, Flex, Box, Button, Text, Callout } from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons"
import * as Dialog from '@radix-ui/react-dialog'
import * as Form from '@radix-ui/react-form'
import { Card } from './Card';
import { FoodSelect, FoodTag } from './FoodList';
import FoodDialog from './EditFoodDialog';
import type { Food, Combo, Record } from '../interface';
import { calculateCalories, themeConfig } from '../utils';
import { useRecordStore, useFoodStore } from '../store';

const inputClass = 'rounded-md outline-none text-[var(--accent-a11)] bg-[var(--accent-a3)] ml-1'

type NameDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editRecord?: Record
  copyRecord?: Record
}

function RecordForm({formData, setFormData, onClose}) {
    return (
        <Form.Root className="flex gap-2 items-end">
            <button
                type="button"
                onClick={onClose}
                className="text-[var(--accent-a9)] hover:text-[var(--accent-a11)] p-1"
            >
                ←
            </button>
            <Form.Field name="name" >
                <Form.Label>
                    <Text size="2" weight="medium"></Text>
                </Form.Label>
                <Form.Control asChild>
                    <input
                    defaultValue={formData.name}
                    className={`${inputClass} px-2 p-1 w-26`}
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    autoFocus
                    />
                </Form.Control>
            </Form.Field>
            <Form.Field name="notice" className='ml-[auto]' >
                <Form.Label>
                    <Text size="2" weight="medium">备注</Text>
                </Form.Label>
                <Form.Control asChild>
                    <input
                    className={`${inputClass} px-2 p-1 w-32`}
                    value={formData.notice}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notice: e.target.value }))}
                    />
                </Form.Control>
            </Form.Field>
        </Form.Root>
    )
}

function AddForm({ onConfirm, formData, setFormData }) {
    return  (        
        <Form.Root className="flex gap-1 justify">
            <Form.Field name="weight" className='flex-1' >
                <Form.Label>
                    <Text size="2" weight="medium">每份克重</Text>
                </Form.Label>
                <Form.Control asChild>
                    <input
                        type="number"
                        inputMode="decimal"
                        defaultValue={100}
                        className={`${inputClass} px-2 p-1 w-12`}
                        value={formData.weight}
                        onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
                    />
                </Form.Control>
            </Form.Field>
            
            <Form.Field name="count" className='flex-1 flex items-center' >
                <Text size="2" weight="medium">x 份数</Text>
                <div className="flex items-center gap-0.5 flex-nowrap">
                  <Form.Control asChild>
                      <input
                      type="number"
                      inputMode="decimal"
                      defaultValue={1}
                      className={`${inputClass} px-1 p-1 w-6`}
                      value={formData.count}
                      onChange={(e) => setFormData((prev) => ({ ...prev, count: e.target.value }))}
                      />
                  </Form.Control>
                  <div className="flex flex-col">
                    <button
                      type="button"
                      className="text-xs leading-none px-1 py-0.5 text-[var(--accent-a11)] hover:bg-[var(--accent-a3)] rounded-t"
                      onClick={() => setFormData((prev) => ({ ...prev, count: Math.max(1, Number(prev.count) + 1) }))}
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      className="text-xs leading-none px-1 py-0.5 text-[var(--accent-a11)] hover:bg-[var(--accent-a3)] rounded-b"
                      onClick={() => setFormData((prev) => ({ ...prev, count: Math.max(1, Number(prev.count) - 1) }))}
                    >
                      ▼
                    </button>
                  </div>
                </div>
            </Form.Field>
            <Button
                variant="solid"
                type="button"
                onClick={onConfirm}
                className='flex-0'
                style={{ marginLeft: 'auto' }}
            >
                确认分量
            </Button> 
        </Form.Root>   
    )
}

type FormData = {
    name: string
    notice: string
    weight: number
    count: number
}
const useAddRecordPage = (editRecord?: Record) => {
    const allFoods = useFoodStore((state) => state.foods);
    const addFoodToStore = useFoodStore((state) => state.addFood);
    const updateFoodInStore = useFoodStore((state) => state.updateFood);
    const removeFoodInStore = useFoodStore((state) => state.removeFood);
    // 记录表单
    const [formData, setFormData] = React.useState<FormData>(() => {
        if (editRecord) {
            const c = editRecord.content;
            const notice = 'notice' in c ? (c as Combo).notice : '';
            return { name: c.name, notice, weight: 100, count: 1 };
        }
        return { name: '午餐', notice: '', weight: 100, count: 1 };
    });
    // 当前已选择的食物列表
    const [selectedFoods, setSelectedFoods] = React.useState<Food[]>(() => {
        if (editRecord) {
            const c = editRecord.content;
            return 'foods' in c ? [...(c as Combo).foods] : [{ ...(c as Food) }];
        }
        return [];
    });

    // 选择区内选中的食物
    const [selectedId, setId] = React.useState('');

    // 选中食物时，每份克重跟随食物的 defaultWeight，份数重置为1
    React.useEffect(() => {
        if (!selectedId) return;
        const food = allFoods.find((f) => f.id === selectedId);
        if (food) {
            setFormData((prev) => ({ ...prev, weight: food.defaultWeight, count: 1 }));
        }
    }, [selectedId, allFoods]);

    // 添加食物到已选列表（营养素按实际重量缩放）
    const handleAddFoodToSelection = () => {
        if (!selectedId) return;

        const food = allFoods.find((f) => f.id === selectedId);
        if (!food) return;

        const actualWeight = formData.weight * formData.count;
        const scale = actualWeight / 100;

        const foodWithScaledNutrients: Food = {
            ...food,
            id: `${food.id}-${Date.now()}`, // 允许同一食物多次添加
            weight: actualWeight,
            nutrients: {
                carb: Math.round(food.nutrients.carb * scale * 100) / 100,
                protein: Math.round(food.nutrients.protein * scale * 100) / 100,
                fat: Math.round(food.nutrients.fat * scale * 100) / 100,
                calories: Math.round(food.nutrients.calories * scale),
            },
        };

        setSelectedFoods((prev) => [...prev, foodWithScaledNutrients]);
    };

    // 从已选列表移除食物
    const handleRemoveFoodFromSelection = (foodId: string) => {
        setSelectedFoods((prev) => prev.filter((f) => f.id !== foodId));
    };

    const clearSelectedFoods = React.useCallback(() => setSelectedFoods([]), []);

    return {
        formData,
        setFormData,
        selectedId,
        setId,
        selectedFoods,
        setSelectedFoods,
        handleAddFoodToSelection,
        handleRemoveFoodFromSelection,
        clearSelectedFoods,
        allFoods,
        addFoodToStore,
        updateFoodInStore,
        removeFoodInStore,
    }
}

export default function AddRecordDialog({
  open,
  onOpenChange,
  editRecord,
  copyRecord,
}: NameDialogProps) {
    const record = editRecord || copyRecord;
    const {
        formData,
        setFormData,
        selectedId,
        setId,
        selectedFoods,
        setSelectedFoods,
        handleAddFoodToSelection,
        handleRemoveFoodFromSelection,
        clearSelectedFoods,
        allFoods,
        addFoodToStore,
        updateFoodInStore,
        removeFoodInStore,
    } = useAddRecordPage(record)

    const addRecord = useRecordStore((state) => state.addRecord);
    const updateRecord = useRecordStore((state) => state.updateRecord);

    // 弹窗打开时，根据模式填充数据
    React.useEffect(() => {
        if (open) {
            const record = editRecord || copyRecord;
            if (record) {
                const c = record.content;
                const notice = 'notice' in c ? (c as Combo).notice : '';
                setFormData({ name: c.name, notice, weight: 100, count: 1 });
                const foods = 'foods' in c ? [...(c as Combo).foods] : [{ ...(c as Food) }];
                setSelectedFoods(foods);
            } else {
                setFormData({ name: '午餐', notice: '', weight: 100, count: 1 });
                setSelectedFoods([]);
            }
        }
    }, [open, editRecord, copyRecord]);

    const handleSave = React.useCallback(() => {
        if (selectedFoods.length === 0) return;

        const aggregateNutrients = selectedFoods.reduce(
            (acc, f) => ({
                carb: acc.carb + f.nutrients.carb,
                protein: acc.protein + f.nutrients.protein,
                fat: acc.fat + f.nutrients.fat,
                calories: acc.calories + f.nutrients.calories,
            }),
            { carb: 0, protein: 0, fat: 0, calories: 0 }
        );

        const isEdit = !!(editRecord && !copyRecord);
        const combo: Combo = {
            id: isEdit ? (editRecord.content as Combo).id : `combo-${Date.now()}`,
            name: formData.name,
            icon: selectedFoods[0]?.icon || '',
            foods: selectedFoods,
            nutrients: aggregateNutrients,
            notice: formData.notice,
        };

        if (isEdit) {
            updateRecord(editRecord.id, { content: combo });
        } else {
            const now = new Date();
            const record: Record = {
                id: String(Date.now()),
                content: combo,
                eatTime: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
                eatDate: now.toISOString().split('T')[0],
            };
            addRecord(record);
        }

        onOpenChange(false);
    }, [selectedFoods, formData, editRecord, copyRecord, addRecord, updateRecord, onOpenChange]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Theme accentColor={themeConfig.accentColor}>
        <Dialog.Content
          aria-label=""
          className="fixed top-1/2 left-1/2 w-full h-full max-w-md -translate-x-1/2 -translate-y-1/2 shadow-lg bg-white"
        >
            <div className="flex flex-col gap-2 text-[var(--accent-8)] p-5 h-full bg-[var(--accent-surface)]">
                <RecordForm formData={formData} setFormData={setFormData} onClose={() => onOpenChange(false)} />
                <Flex direction="row" gap="3" align="center" justify="start" className='rounded-md p-4 flex-wrap' style={{ border: "2px dashed var(--accent-a5)" }}>
                    {selectedFoods.length === 0 ? (
                        <div className="text-sm text-[var(--gray-8)]">请选择食物并点击添加</div>
                    ) : (
                        selectedFoods.map((food) => (
                            <Card
                                key={food.id}
                                className='w-auto'
                                title={food.name}
                                subTitle={`${food.weight || 100}g ${food.nutrients.carb.toFixed(0)}|${food.nutrients.protein.toFixed(0)}|${food.nutrients.fat.toFixed(0)}`}
                                content={`${Math.round(food.nutrients.calories)}卡`}
                                onClick={() => handleRemoveFoodFromSelection(food.id)}
                            />
                        ))
                    )}
                </Flex>

                <div className="flex gap-2 mb-4 justify-end">
                    <Button
                        type="button"
                        variant="soft"
                        onClick={clearSelectedFoods}
                        style={{ flex: 1, height: '3rem' }}
                    >
                        清空选择
                    </Button>

                    <Button
                        type="submit"
                        variant="solid"
                        onClick={handleSave}
                        style={{ flex: 3, height: '3rem' }}
                    >
                        {copyRecord ? '复制记录' : editRecord ? '保存修改' : '记一餐'}
                    </Button>
                </div>
                <AddForm
                    onConfirm={() => handleAddFoodToSelection()}
                    formData={formData}
                    setFormData={setFormData}
                />
                <FoodSelect
                    selectedId={selectedId}
                    setId={setId}
                    foods={allFoods}
                    addFood={addFoodToStore}
                    updateFood={updateFoodInStore}
                    removeFood={removeFoodInStore}
                />
            </div> 
        </Dialog.Content>
        </Theme>
      </Dialog.Portal>
    </Dialog.Root>

  )
}
