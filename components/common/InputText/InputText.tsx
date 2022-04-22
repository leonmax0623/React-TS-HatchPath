import {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from 'react'

import {
  Input as ChakraInput,
  InputGroup as ChakraInputGroup,
  InputLeftElement as ChakraInputLeftElement,
  InputRightElement as ChakraInputRightElement,
} from '@chakra-ui/react'
import { forwardRef } from '@chakra-ui/system'

import cn from 'util/classnames'

import { CommonProps } from 'types/common'

import Icon, { IconProps } from '../Icon'
import InputWrapper, { InputWrapperProps } from '../InputWrapper'

export type InputTextSizeProps = 'xs' | 'sm' | 'md' | 'lg'
export type InputTextProps = CommonProps &
  InputWrapperProps & {
    inputClassName?: string
    // function props
    name?: string
    value?: string
    type?: 'text' | 'email' | 'password' | 'number'
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
    onValueChange?: (value: string) => void
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void
    onFocus?: (e: FocusEvent<HTMLInputElement>) => void
    onEnter?: (e: KeyboardEvent<HTMLInputElement>) => void
    onDown?: (e: KeyboardEvent<HTMLInputElement>) => void
    onUp?: (e: KeyboardEvent<HTMLInputElement>) => void
    onClick?: (e: MouseEvent<HTMLInputElement>) => void
    disabled?: boolean
    loading?: boolean
    disableAutoComplete?: boolean
    // content props
    size?: InputTextSizeProps
    placeholder?: string
    topDecorator?: ReactNode
    leftIcon?: IconProps
    rightIcon?: IconProps
  }
const InputText = forwardRef<InputTextProps, 'input'>(
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
      type,
      onChange = () => undefined,
      onValueChange = () => undefined,
      onBlur = () => undefined,
      onFocus = () => undefined,
      onEnter = () => undefined,
      onUp = () => undefined,
      onDown = () => undefined,
      onClick = () => undefined,
      disabled,
      disableAutoComplete = false,
      // content props
      size = 'md',
      placeholder,
      topDecorator,
      leftIcon,
      rightIcon,
    }: InputTextProps,
    ref,
  ) => {
    return (
      <InputWrapper
        id={id}
        className={className}
        label={label}
        helper={helper}
        error={error}
        size={size}
      >
        {topDecorator}
        <ChakraInputGroup className="bg-white">
          {leftIcon && (
            <ChakraInputLeftElement>
              <Icon {...leftIcon} />
            </ChakraInputLeftElement>
          )}
          <ChakraInput
            id={id}
            className={cn('!bg-gray-100', inputClassName)}
            name={name}
            value={value}
            onChange={(e) => {
              onValueChange(e.target.value)
              onChange(e)
            }}
            onBlur={onBlur}
            onFocus={onFocus}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && onEnter) {
                e.preventDefault()
                onEnter(e)
              } else if (e.key === 'ArrowUp' && onUp) {
                e.preventDefault()
                onUp(e)
              } else if (e.key === 'ArrowDown' && onDown) {
                e.preventDefault()
                onDown(e)
              }
            }}
            onClick={onClick}
            placeholder={placeholder}
            type={type}
            disabled={disabled}
            size={size}
            ref={ref}
            autoComplete={disableAutoComplete ? 'off' : undefined}
          />
          {rightIcon && (
            <ChakraInputRightElement className="!h-full">
              <Icon {...rightIcon} />
            </ChakraInputRightElement>
          )}
        </ChakraInputGroup>
      </InputWrapper>
    )
  },
)
export default InputText
