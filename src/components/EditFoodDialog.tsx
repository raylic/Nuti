import React from 'react'
import { Theme, Flex, Text, Callout } from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons"
import * as Form from '@radix-ui/react-form'
import { themeConfig } from '../utils';
import type { Food } from '../interface';

const inputClass = 'rounded-md outline-none text-[var(--accent-a11)] bg-[var(--accent-a3)] ml-1'

type FormData = {
    name: string,
    weight: number | string,
    carb: number | string,
    protein: number | string,
    fat: number | string,
  }

type NameDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  formData: FormData,
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleSubmit?: () => void;
  editFood?: Food;
  onDelete?: () => void;
}

export default function FoodDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  handleSubmit,
  editFood,
  onDelete,
}: NameDialogProps) {
  const isValid = Object.values(formData).every((val) => val !== '' && val !== null && val !== undefined)
  const [confirmingDelete, setConfirmingDelete] = React.useState(false);

  React.useEffect(() => {
    if (!open) setConfirmingDelete(false);
  }, [open]);

  React.useEffect(() => {
    if (open && editFood) {
      setFormData({
        name: editFood.name,
        weight: editFood.defaultWeight,
        carb: editFood.nutrients.carb,
        protein: editFood.nutrients.protein,
        fat: editFood.nutrients.fat,
      });
    }
  }, [open, editFood]);

  if (!open) return null;

  return (
    <Theme accentColor={themeConfig.accentColor} appearance={themeConfig.appearance}>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={() => onOpenChange(false)} />
      {/* Content panel */}
      <div
        className="fixed top-1/2 left-1/2 w-[80%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg bg-white z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className='p-5 rounded-lg bg-[var(--accent-surface)]'>
          <div className="mb-3 text-center text-[var(--accent-a11)]">
            <Text size="4" weight="medium">{editFood ? '编辑食物' : '新建食物'}</Text>
          </div>
          <Form.Root>
            <div className="flex flex-col gap-2 text-[var(--accent-8)]">
              <div className="flex gap-2">
                <Form.Field name="name" >
                  <Form.Label>
                    <Text size="2" weight="medium">名称</Text>
                  </Form.Label>
                  <Form.Control asChild>
                    <input
                      defaultValue={formData.name}
                      className={`${inputClass} px-2 p-1 w-22`}
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      autoFocus
                    />
                  </Form.Control>
                </Form.Field>
                <Form.Field name="weight" >
                  <Form.Label>
                    <Text size="2" weight="medium">默认每份</Text>
                  </Form.Label>
                  <Form.Control asChild>
                    <input
                      type="number"
                      defaultValue={100}
                      className={`${inputClass} px-2 p-1 w-12 mr-1`}
                      value={formData.weight}
                      onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
                    />
                  </Form.Control>
                  <Form.Label>
                    <Text size="2" weight="medium">克</Text>
                  </Form.Label>
                </Form.Field>
              </div>

              <Flex direction="column" gap="3" align="start">
                <Callout.Root size="1" variant="outline" className='w-full'>
                  <Callout.Icon>
                    <InfoCircledIcon />
                  </Callout.Icon>
                  <Callout.Text>
                    每一百克的营养成分，输入数字
                  </Callout.Text>
                </Callout.Root>
              </Flex>
              <div className="flex gap-2">
                <Form.Field name="carb">
                  <Form.Label>
                    <Text size="2" weight="medium">碳水</Text>
                  </Form.Label>
                  <Form.Control asChild>
                    <input
                      type="number"
                      value={formData.carb}
                      onChange={(e) => setFormData((prev) => ({ ...prev, carb: e.target.value }))}
                      className={`${inputClass} w-12 px-2 p-1`}
                    />
                  </Form.Control>
                </Form.Field>
                <Form.Field name="protein">
                  <Form.Label>
                    <Text size="2" weight="medium">蛋白</Text>
                  </Form.Label>
                  <Form.Control asChild>
                    <input
                      type="number"
                      value={formData.protein}
                      className={`${inputClass} w-12 px-2 py-1`}
                      onChange={(e) => setFormData((prev) => ({ ...prev, protein: e.target.value }))}
                    />
                  </Form.Control>
                </Form.Field>
                <Form.Field name="fat">
                  <Form.Label>
                    <Text size="2" weight="medium">脂肪</Text>
                  </Form.Label>
                  <Form.Control asChild>
                    <input
                      type="number"
                      value={formData.fat}
                      className={`${inputClass} w-12 px-2 py-1`}
                      onChange={(e) => setFormData((prev) => ({ ...prev, fat: e.target.value }))}
                    />
                  </Form.Control>
                </Form.Field>
              </div>

              <div className="flex gap-2 mt-4 justify-end">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-md text-sm font-medium bg-[var(--accent-a3)] text-[var(--accent-a11)]"
                  onClick={() => { onOpenChange(false); setConfirmingDelete(false); }}
                >
                  取消
                </button>

                <button
                  disabled={!isValid}
                  type="button"
                  className={`px-3 py-1.5 rounded-md text-sm font-medium text-white ${isValid ? 'bg-[var(--accent-9)] hover:bg-[var(--accent-10)]' : 'bg-[var(--accent-a5)] cursor-not-allowed'}`}
                  onClick={handleSubmit}
                >
                  确认
                </button>
              </div>
            </div>
          </Form.Root>
          {editFood && onDelete ? (
            <div className="mt-3 pt-3 border-t border-[var(--accent-a5)]">
              {confirmingDelete ? (
                <div className="flex gap-2 items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                      onClick={() => { onDelete(); setConfirmingDelete(false); }}
                    >
                      是
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-md text-sm font-medium bg-[var(--accent-a3)] text-[var(--accent-a11)] hover:bg-[var(--accent-a4)] transition-colors"
                      onClick={() => setConfirmingDelete(false)}
                    >
                      否
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="w-full px-3 py-1.5 rounded-md text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                  onClick={() => setConfirmingDelete(true)}
                >
                  删除
                </button>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </Theme>
  )
}
