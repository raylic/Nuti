import React from 'react';
import { IconButton } from '@radix-ui/themes';
import { PlusIcon } from '@radix-ui/react-icons';
import { Button } from '@radix-ui/themes';
import FoodDialog from './EditFoodDialog';
import type { Food } from '../interface';
import { calculateCalories } from '../utils';

interface FoodTagProps {
    title: string;
    selected: boolean;
    onClick: () => void;
    onLongPress?: () => void;
}

export const FoodTag: React.FC<FoodTagProps> = ({ title, selected, onClick, onLongPress }) => {
    const longPressTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const isLongPressRef = React.useRef(false);

    React.useEffect(() => {
        return () => {
            if (longPressTimerRef.current) {
                clearTimeout(longPressTimerRef.current);
            }
        };
    }, []);

    const startTimer = React.useCallback(() => {
        isLongPressRef.current = false;
        longPressTimerRef.current = setTimeout(() => {
            isLongPressRef.current = true;
            onLongPress?.();
        }, 500);
    }, [onLongPress]);

    const clearTimer = React.useCallback(() => {
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    }, []);

    const handleClick = React.useCallback(() => {
        if (isLongPressRef.current) {
            isLongPressRef.current = false;
            return;
        }
        onClick();
    }, [onClick]);

    return (
        <div
            onClick={handleClick}
            onMouseDown={startTimer}
            onMouseUp={clearTimer}
            onMouseLeave={clearTimer}
            onTouchStart={startTimer}
            onTouchEnd={clearTimer}
            onTouchMove={clearTimer}
            className={`inline-block text-lg ${selected ? 'text-[var(--accent-surface)]' : 'text-[var(--accent-a9)]'} font-semibold rounded-lg shadow-md px-2 py-1 ${selected ? 'bg-[var(--accent-a10)]' : 'bg-[var(--accent-a2)]'} `}
        >
            {title}
        </div>
    );
};

interface FoodSelectProps {
    selectedId: string;
    setId: (id: string) => void;
    foods: Food[];
    addFood: (food: Food) => void;
    updateFood: (id: string, updatedFood: Partial<Food>) => void;
    removeFood: (id: string) => void;
}

export const FoodSelect = ({ selectedId, setId, foods, addFood, updateFood, removeFood }: FoodSelectProps) => {
    // 控制食物详情弹窗显示
    const [visible, setVisible] = React.useState(false)
    const [foodFormData, setFoodFormData] = React.useState<{
        name: string
        weight: string | number
        carb: string | number
        protein: string | number
        fat: string | number
    }>({
        name: '',
        weight: '',
        carb: '',
        protein: '',
        fat: '',
    })
    const [editingFood, setEditingFood] = React.useState<Food | null>(null)

    const handleAddFood = () => {
        if (!addFood || !foodFormData.name) return;
        const newFood: Food = {
            id: `food-${Date.now()}`,
            name: foodFormData.name,
            icon: '',
            nutrients: {
                carb: Number(foodFormData.carb),
                protein: Number(foodFormData.protein),
                fat: Number(foodFormData.fat),
                calories: calculateCalories(Number(foodFormData.carb), Number(foodFormData.fat), Number(foodFormData.protein)),
            },
            defaultWeight: Number(foodFormData.weight),
        };
        addFood(newFood);
        setVisible(false);
        setFoodFormData({ name: '', weight: '', carb: '', protein: '', fat: '' });
    };

    const handleEditSubmit = () => {
        if (!updateFood || !editingFood || !foodFormData.name) return;
        updateFood(editingFood.id, {
            name: foodFormData.name,
            icon: '',
            nutrients: {
                carb: Number(foodFormData.carb),
                protein: Number(foodFormData.protein),
                fat: Number(foodFormData.fat),
                calories: calculateCalories(Number(foodFormData.carb), Number(foodFormData.fat), Number(foodFormData.protein)),
            },
            defaultWeight: Number(foodFormData.weight),
        });
        setVisible(false);
        setFoodFormData({ name: '', weight: '', carb: '', protein: '', fat: '' });
        setEditingFood(null);
    };

    const handleDelete = () => {
        if (!editingFood || !removeFood) return;
        removeFood(editingFood.id);
        setVisible(false);
        setFoodFormData({ name: '', weight: '', carb: '', protein: '', fat: '' });
        setEditingFood(null);
    };

    const handleSubmit = () => {
        if (editingFood) {
            handleEditSubmit();
        } else {
            handleAddFood();
        }
    };

    return (
        <>
            <div className='flex flex-wrap gap-3 rounded-md p-4 align-center justify-center' style={{ border: "2px dashed var(--accent-a5)" }}>
                <IconButton style={{ borderRadius: '32px'}} size='2' variant='classic' onClick={() => {
                    setEditingFood(null);
                    setFoodFormData({ name: '', weight: '', carb: '', protein: '', fat: '' });
                    setVisible(true);
                }}>
                    <PlusIcon />
                </IconButton>
                {foods.map(item => (
                    <FoodTag
                        key={item.id}
                        onClick={() => setId(item.id)}
                        onLongPress={() => {
                            setEditingFood(item);
                            setVisible(true);
                        }}
                        title={item.name}
                        selected={selectedId === item.id}
                    />
                ))}
            </div>
            <FoodDialog
                open={visible}
                onOpenChange={setVisible}
                formData={foodFormData}
                handleSubmit={handleSubmit}
                setFormData={setFoodFormData}
                editFood={editingFood ?? undefined}
                onDelete={editingFood ? handleDelete : undefined}
            />
        </>
    )
}