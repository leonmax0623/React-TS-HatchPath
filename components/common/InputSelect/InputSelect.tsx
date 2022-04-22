import { createRef, useCallback, useEffect, useState } from 'react'

import { useOutsideClick } from '@chakra-ui/hooks'

import cn from 'util/classnames'

import { CommonProps } from 'types/common'

import { IconProps } from '../Icon'
import InputText from '../InputText'
import InputWrapper, { InputWrapperProps } from '../InputWrapper'
import Popover from '../Popover'

export type InputSelectOptionType<T extends string> = {
  value: T
  label: string
  icon?: IconProps
}

type InputSelectProps<T extends string> = CommonProps &
  InputWrapperProps & {
    // function props
    name?: string
    value?: T
    onChange?: (e: { target: { name?: string; value?: T } }) => void
    onValueChange?: (value?: T) => void
    options?: InputSelectOptionType<T>[]
    size?: 'sm' | 'md' | 'lg'
  }
const InputSelect = <T extends string>({
  id,
  className,
  // function props
  label,
  helper,
  error,
  name,
  value,
  onChange = () => undefined,
  onValueChange = () => undefined,
  options = [],
  size = 'md',
}: InputSelectProps<T>): JSX.Element => {
  const inputRef = createRef<HTMLInputElement>()
  const popoverRef = createRef<HTMLUListElement>()
  const [edit, setEdit] = useState<{ label: string; icon?: IconProps }>({
    label: '',
    icon: undefined,
  })
  const [open, setOpen] = useState<boolean>(false)

  useOutsideClick({
    ref: popoverRef,
    handler: () => {
      setOpen(false)
    },
  })

  const handleChange = useCallback(
    (next: T) => {
      onValueChange(next)
      onChange({ target: { name, value: next } })
    },
    [name, onValueChange, onChange],
  )

  useEffect(() => {
    const matchIdx = options.findIndex((option) => option.value === value)
    if (matchIdx >= 0) {
      const match = options[matchIdx]
      if (popoverRef.current) {
        popoverRef.current?.scrollTo(0, matchIdx * 40)
      }
      setEdit({ label: match.label, icon: match.icon })
    } else {
      setEdit({ label: '', icon: undefined })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, options])

  return (
    <InputWrapper
      className={className}
      label={label}
      helper={helper}
      size={size}
    >
      <Popover
        trigger="click"
        open={open}
        matchWidth={true}
        showArrow={false}
        returnFocus={false}
        contentClassName="!p-0 bg-white"
        content={
          <ul ref={popoverRef} className="overflow-y-auto max-h-50">
            {options?.map((option, idx) => (
              <li
                key={idx}
                className={cn(
                  'flex flex-row items-center first:rounded-t last:rounded-b cursor-pointer',
                  {
                    'bg-teal-300': option.value === value,
                    'hover:bg-teal-100': option.value !== value,
                  },
                  {
                    'p-1 text-sm': size === 'sm',
                    'p-2 text-md': size === 'md' || size === 'lg',
                  },
                )}
                role="button"
                onClick={() => {
                  handleChange(option.value)
                  setEdit({
                    label: option.label,
                    icon: option.icon,
                  })
                  setOpen(false)
                }}
              >
                {option.icon && <div className="mr-2">{option.icon}</div>}
                {option.label}
              </li>
            ))}
          </ul>
        }
      >
        <InputText
          id={id}
          ref={inputRef}
          name={name}
          value={edit.label}
          inputClassName="cursor-pointer"
          onClick={() => setOpen(true)}
          leftIcon={edit.icon}
          rightIcon={{
            icon: 'chevron-down',
            onClick: () => setOpen(true),
          }}
          size={size}
          error={error}
        />
      </Popover>
    </InputWrapper>
  )
}
export default InputSelect
