import { ReactNode } from 'react'

import cn from 'util/classnames'

import { CommonProps, SyntheticChangeEvent } from 'types/common'

import InputWrapper, { InputWrapperProps } from '../InputWrapper'

type SelectButtonProps = CommonProps &
  InputWrapperProps & {
    listClassName?: string
    itemClassName?: string
    // function props
    items: {
      id: string
      className?: string
      content: ReactNode
    }[]
    name?: string
    value?: string
    onChange?: (e: SyntheticChangeEvent<string>) => void
    onValueChange?: (next: string) => void
  }
const SelectButton = ({
  id,
  className,
  listClassName,
  itemClassName,
  // input wrapper props
  label,
  error,
  helper,
  // function props
  name,
  value,
  items,
  onChange = () => undefined,
  onValueChange = () => undefined,
}: SelectButtonProps) => {
  return (
    <InputWrapper
      id={id}
      className={cn('flex flex-row items-center', className)}
      label={label}
      error={error}
      helper={helper}
    >
      <ul className={cn('flex flex-row gap-x-2 items-stretch', listClassName)}>
        {items.map(({ id, className, content }, idx) => (
          <li
            key={idx}
            className={cn(
              'grow py-2 px-1 rounded border-2 cursor-pointer',
              {
                'border-gray-300 hover:border-blue-300': id !== value,
                'text-blue-700 hover:text-blue-800 border-blue-500 hover:border-blue-600':
                  !!id && !!value && id === value,
              },
              itemClassName,
              className,
            )}
            onClick={() => {
              onChange({
                target: {
                  name,
                  value: id,
                },
              })
              onValueChange(id)
            }}
            role="button"
          >
            {content}
          </li>
        ))}
      </ul>
    </InputWrapper>
  )
}
export default SelectButton
