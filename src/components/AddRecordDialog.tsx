import React from 'react'
import { Theme, Flex, Box, Button, Text, Callout } from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons"
import * as Dialog from '@radix-ui/react-dialog'
import * as Form from '@radix-ui/react-form'
import { Card } from './Combo';
import { FoodSelect, FoodTag } from './FoodList';
import FoodDialog from './EditFoodDialog';
import type { Food } from '../interface';
import { foods } from '../mock'
import { calculateCalories } from '../utils';

const inputClass = 'rounded-md outline-none text-[var(--accent-a11)] bg-[var(--accent-a3)] ml-1'

type NameDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function RecordForm({formData, setFormData}) {
    return (
        <Form.Root className="flex gap-2 justify-between">
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
            <Form.Field name="notice" >
                <Form.Label>
                    <Text size="2" weight="medium">备注</Text>
                </Form.Label>
                <Form.Control asChild>
                    <input
                    type="number"
                    defaultValue={100}
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
                添加
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

    // 选中 / 取消选中食物
    // const toggleSelectFood = (food: FoodItem) => {
    //     setSelectedFoods((prev) => {
    //         const exists = prev.find((f) => f.id === food.id)
    //         if (exists) return prev.filter((f) => f.id !== food.id)
    //         return [...prev, food]
    //     })
    // }

    // const addFood = (food: FoodItem) => {
    //     setSelectedFoods((prev) => [...prev, food])
    // }

    // const removeFood = (id: string | number) => {
    //     setSelectedFoods((prev) => prev.filter((f) => f.id !== id))
    // }

    // 添加食物到记录
    const addFood2Record = () => {
        const payload = {
            ...formData,
            timestamp: Date.now(),
        }
        // 通过currenId找到当前的食物列表

        // setSelectedFoods selectedFoods.push()

        // 清除当前选中，按钮置灰

        return payload
    }
    
    const addFood = () => {
        const id = Date.now();
        const newFood: Food = {
            id: String(id),
            name: foodFormData.name,
            nutrients: {
                carb: Number(foodFormData.carb),
                protein: Number(foodFormData.protein),
                fat: Number(foodFormData.fat),
                calories: calculateCalories(Number(foodFormData.carb), Number(foodFormData.fat), Number(foodFormData.protein))
            },
            defaultWeight: Number(foodFormData.weight),
        }
        setAllFoods((list) => [newFood, ...list]);
        // 关闭
        // 清空表单
    }

    return {
        formData,
        setFormData,
        // visible,
        // setVisible,
        selectedId,
        setId,
        selectedFoods,
        // toggleSelectFood,
        addFood,
        // foodFormData,
        // setFoodFormData,
        // removeFood,
        addFood2Record,
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
        addFood2Record,
        allFoods,
        addFood,
    } = useAddRecordPage()

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Theme accentColor="orange">
        <Dialog.Content
          aria-label=""
          className="fixed top-1/2 left-1/2 w-full h-full max-w-md -translate-x-1/2 -translate-y-1/2 shadow-lg bg-white"
        >
            <div className="flex flex-col gap-2 text-[var(--accent-8)] p-5 h-full bg-[var(--accent-surface)]">
                <RecordForm formData={formData} setFormData={setFormData} />
                <Flex direction="row" gap="3" align="center" justify="start" className='rounded-md p-4' style={{ border: "2px dashed var(--accent-a5)" }}>
                    <Card
                        className='w-auto'
                        title="香蕉"
                        subTitle="100g 50|60|70"
                        content="300卡"
                    />
                </Flex>

                <div className="flex gap-2 mb-4 justify-end">
                    <Button
                        type="button"
                        variant="soft"
                        // onClick={() => onOpenChange(false)}
                        style={{ flex: 1, height: '3rem' }}
                    >
                        存为套餐
                    </Button>

                    <Button
                        type="submit"
                        variant="solid"
                        onClick={() => onOpenChange(false)}
                        style={{ flex: 3, height: '3rem' }}
                    >
                        记录
                    </Button>
                </div>
                <AddForm
                    onConfirm={() => addFood2Record()}
                    formData={formData}
                    setFormData={setFormData}
                />
                <FoodSelect
                    selectedId={selectedId}
                    setId={setId}
                    foods={allFoods}
                    addFood={addFood}
                />
            </div> 
        </Dialog.Content>
        </Theme>
      </Dialog.Portal>
    </Dialog.Root>

  )
}
