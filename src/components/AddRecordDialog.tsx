import React from 'react'
import { Theme, Flex, Box, Button, Text, Callout } from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons"
import * as Dialog from '@radix-ui/react-dialog'
import * as Form from '@radix-ui/react-form'
import { Card } from './Card';
import { FoodSelect, FoodTag } from './FoodList';
import FoodDialog from './EditFoodDialog';
import type { Food } from '../interface';
import { foods } from '../mock'
import { calculateCalories, themeConfig } from '../utils';
import { useRecordStore } from '../store';

const inputClass = 'rounded-md outline-none text-[var(--accent-a11)] bg-[var(--accent-a3)] ml-1'

type NameDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
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
        <Form.Root className="flex gap-1 justify-start">
            <Form.Field name="weight" >
                <Form.Label>
                    <Text size="2" weight="medium">每份克重</Text>
                </Form.Label>
                <Form.Control asChild>
                    <input
                        defaultValue={100}
                        className={`${inputClass} px-2 p-1 w-12`}
                        value={formData.weight}
                        onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
                    />
                </Form.Control>
            </Form.Field>
            
            <Form.Field name="count" >
                <Form.Label>
                    <Text size="2" weight="medium">x 份数</Text>
                </Form.Label>
                <Form.Control asChild>
                    <input
                    defaultValue={1}
                    className={`${inputClass} px-2 p-1 w-8`}
                    value={formData.count}
                    onChange={(e) => setFormData((prev) => ({ ...prev, count: e.target.value }))}
                    />
                </Form.Control>
            </Form.Field>

            <Button
                variant="solid"
                type="button"
                onClick={onConfirm}
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
const useAddRecordPage = () => {
    const [allFoods, setAllFoods] = React.useState<Food[]>(foods);
    // 记录表单
    const [formData, setFormData] = React.useState<FormData>({
        name: '午餐',
        notice: '',
        weight: 100,
        count: 1,
    })
    // 当前已选择的食物列表
    const [selectedFoods, setSelectedFoods] = React.useState<Food[]>([])

    // 选择区内选中的食物
    const [selectedId, setId] = React.useState('');

    // 选中食物时，每份克重跟随食物的 defaultWeight
    React.useEffect(() => {
        if (!selectedId) return;
        const food = allFoods.find((f) => f.id === selectedId);
        if (food) {
            setFormData((prev) => ({ ...prev, weight: food.defaultWeight }));
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
                calories: Math.round(food.nutrients.calories * scale * 100) / 100,
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
        handleAddFoodToSelection,
        handleRemoveFoodFromSelection,
        clearSelectedFoods,
        allFoods,
    }
}

export default function AddRecordDialog({
  open,
  onOpenChange,
}: NameDialogProps) {
    const {
        formData,
        setFormData,
        selectedId,
        setId,
        selectedFoods,
        handleAddFoodToSelection,
        clearSelectedFoods,
        allFoods,
    } = useAddRecordPage()

    const addRecord = useRecordStore((state) => state.addRecord);

    // 关闭弹窗时清空已选食物
    React.useEffect(() => {
        if (!open) {
            clearSelectedFoods();
        }
    }, [open, clearSelectedFoods]);

    const handleRecord = React.useCallback(() => {
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

        const combo = {
            id: `combo-${Date.now()}`,
            name: formData.name,
            icon: selectedFoods[0]?.icon || '',
            foods: selectedFoods,
            nutrients: aggregateNutrients,
            notice: formData.notice,
        };

        const now = new Date();
        const record = {
            id: String(Date.now()),
            content: combo,
            eatTime: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
            eatDate: now.toISOString().split('T')[0],
        };

        addRecord(record);
        // setSelectedFoods([]);
        onOpenChange(false);
    }, [selectedFoods, formData, addRecord, onOpenChange]);

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
                                content={`${food.nutrients.calories}卡`}
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
                        onClick={handleRecord}
                        style={{ flex: 3, height: '3rem' }}
                    >
                        记一顿
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
                />
            </div> 
        </Dialog.Content>
        </Theme>
      </Dialog.Portal>
    </Dialog.Root>

  )
}
