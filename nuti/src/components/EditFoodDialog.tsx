import React from 'react'
import { Theme, Flex, Box, Button, Text, Callout } from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons"
import * as Dialog from '@radix-ui/react-dialog'
import * as Form from '@radix-ui/react-form'

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
  // trigger?: React.ReactNode
  formData: FormData,
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleSubmit: () => void;
}

export default function FoodDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  handleSubmit
}: NameDialogProps) {
  const isValid = Object.values(formData).every((val) => val !== '' && val !== null && val !== undefined)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Theme accentColor="tomato">
        <Dialog.Content
          aria-label=""
          className="fixed top-1/2 left-1/2 w-[80%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg bg-white"
        >
          <div className='p-5 rounded-lg bg-[var(--accent-surface)]'>
            <Dialog.Title className="mb-3 text-center text-[var(--accent-a11)]">
              <Text size="4" weight="medium">新建食物</Text>
            </Dialog.Title>
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
                        value={
                          formData.carb
                        }
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
                  <Dialog.Close asChild>
                    <Button
                      type="button"
                      variant="soft"
                      onClick={() => onOpenChange(false)}
                      className="w-1/2"
                    >
                      取消
                    </Button>
                  </Dialog.Close>

                  <Button
                    disabled={!isValid}
                    type="button"
                    variant="solid"
                    onClick={handleSubmit}
                    className="px-3 py-2"
                  >
                    确认
                  </Button>
                </div>
              </div>
            </Form.Root>
          </div>
        </Dialog.Content>
        </Theme>
      </Dialog.Portal>
    </Dialog.Root>

  )
}
