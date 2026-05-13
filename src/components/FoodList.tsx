import React from 'react';
import { IconButton } from '@radix-ui/themes';
import { PlusIcon } from '@radix-ui/react-icons';
import { Button } from '@radix-ui/themes';
import FoodDialog from './EditFoodDialog';

interface FoodTagProps {
    title: string;
    selected: boolean;
    onClick: () => void
}

export const FoodTag: React.FC<FoodTagProps> = ({ title, selected, onClick }) => <div onClick={onClick} className={`inline-block text-lg ${selected ? 'text-[var(--accent-surface)]' : 'text-[var(--accent-a9)]'} font-semibold rounded-lg shadow-md px-2 py-1 ${selected ? 'bg-[var(--accent-a10)]' : 'bg-[var(--accent-a2)]'} `}>{title}</div>

export const FoodSelect = ({ selectedId, setId, foods, addFood }) => {
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
    return (
        <>
            <div className='flex flex-wrap gap-3 rounded-md p-4 align-center justify-center' style={{ border: "2px dashed var(--accent-a5)" }}>
                <IconButton style={{ borderRadius: '32px'}} size='2' variant='classic' onClick={() => setVisible(true)}>
                    <PlusIcon />
                </IconButton>
                {foods.map(item => <FoodTag onClick={() => setId(item.id)} title={item.name} selected={selectedId === item.id} /> )}
            </div>
            <FoodDialog
                open={visible}
                onOpenChange={setVisible}
                formData={foodFormData}
                handleSubmit={addFood}
                setFormData={setFoodFormData}
            />
        </>
    )
}