import { PropsWithChildren, useMemo } from 'react'

import {
  FormControl as ChakraFormControl,
  FormLabel as ChakraFormLabel,
  FormErrorMessage as ChakraFormErrorMessage,
  FormHelperText as ChakraFormHelperText,
} from '@chakra-ui/react'

import cn from 'util/classnames'

import { CommonProps } from 'types/common'

export type InputWrapperSizeType = 'xs' | 'sm' | 'md' | 'lg'
export type InputWrapperProps = PropsWithChildren<
  CommonProps & {
    labelClassName?: string
    helperClassName?: string
    label?: string
    helper?: string
    error?: string
    size?: InputWrapperSizeType
  }
>
const InputWrapper = ({
  id,
  className,
  labelClassName,
  helperClassName,
  label,
  helper,
  error,
  size = 'md',
  children,
}: InputWrapperProps): JSX.Element => {
  const fontSize = useMemo(() => {
    switch (size) {
      case 'xs':
        return '!text-xs'
      case 'sm':
        return '!text-sm'
      case 'md':
        return '!text-md'
      case 'lg':
        return '!text-lg'
    }
  }, [size])
  const helperFontSize = useMemo(() => {
    switch (size) {
      case 'xs':
        return '!text-2xs'
      case 'sm':
        return '!text-xs'
      case 'md':
        return '!text-sm'
      case 'lg':
        return '!text-md'
    }
  }, [size])

  return (
    <ChakraFormControl className={className} isInvalid={!!error}>
      {label && (
        <ChakraFormLabel htmlFor={id} className={cn(fontSize, labelClassName)}>
          {label}
        </ChakraFormLabel>
      )}
      {children}
      {error ? (
        <ChakraFormErrorMessage className={cn(helperFontSize, helperClassName)}>
          {error}
        </ChakraFormErrorMessage>
      ) : helper ? (
        <ChakraFormHelperText className={cn(helperFontSize, helperClassName)}>
          {helper}
        </ChakraFormHelperText>
      ) : null}
    </ChakraFormControl>
  )
}
export default InputWrapper
