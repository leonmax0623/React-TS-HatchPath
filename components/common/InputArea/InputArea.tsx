import { ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent } from 'react'

import { Textarea as ChakraTextArea } from '@chakra-ui/react'
import { forwardRef } from '@chakra-ui/system'

import cn from 'util/classnames'

import { CommonProps } from 'types/common'

import InputWrapper, { InputWrapperProps } from '../InputWrapper'

export type InputAreaSizeProps = 'xs' | 'sm' | 'md' | 'lg'
type InputAreaProps = CommonProps &
  InputWrapperProps & {
    inputClassName?: string
    // function props
    name?: string
    value?: string
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
    onValueChange?: (value?: string) => void
    onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void
    onFocus?: (e: FocusEvent<HTMLTextAreaElement>) => void
    onEnter?: (e: KeyboardEvent<HTMLTextAreaElement>) => void
    onClick?: (e: MouseEvent<HTMLTextAreaElement>) => void
    disabled?: boolean
    characterLimit?: number
    // content props
    size?: InputAreaSizeProps
    placeholder?: string
    rows?: number
  }
const InputArea = forwardRef<InputAreaProps, 'textarea'>(
  (
    {
      id,
      className,
      inputClassName,
      // input wrapper props
      label,
      helper,
      error,
      // function props
      name,
      value,
      onChange = () => undefined,
      onValueChange = () => undefined,
      onBlur = () => undefined,
      onFocus = () => undefined,
      onEnter = () => undefined,
      onClick = () => undefined,
      disabled,
      characterLimit,
      // content props
      size = 'md',
      placeholder,
      rows = 4,
    }: InputAreaProps,
    ref,
  ) => {
    return (
      <InputWrapper
        id={id}
        className={className}
        label={label}
        helper={
          helper || characterLimit
            ? `${value?.length || 0} / ${characterLimit}`
            : undefined
        }
        error={error}
        size={size}
      >
        <ChakraTextArea
          id={id}
          className={cn('!bg-gray-100', inputClassName)}
          name={name}
          value={value}
          onChange={(e) => {
            const val = e.target.value
            if (!characterLimit || val.length <= characterLimit) {
              onValueChange(e.target.value)
              onChange(e)
            }
          }}
          onBlur={onBlur}
          onFocus={onFocus}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && onEnter) {
              e.preventDefault()
              onEnter(e)
            }
          }}
          onClick={onClick}
          placeholder={placeholder}
          disabled={disabled}
          size={size}
          rows={rows}
          resize="none"
          isInvalid={!!error}
          ref={ref}
        />
      </InputWrapper>
    )
  },
)
export default InputArea
