import { ReactNode } from 'react'

import {
  FormControl as ChakraFormControl,
  FormLabel as ChakraFormLabel,
  FormErrorMessage as ChakraFormErrorMessage,
  FormHelperText as ChakraFormHelperText,
  Switch as ChakraSwitch,
} from '@chakra-ui/react'

import cn from 'util/classnames'

import { CommonProps } from 'types/common'

type SwitchProps = CommonProps & {
  labelClassName?: string
  // function props
  name?: string
  value?: boolean
  onChange?: (e: { target: { name?: string; value?: boolean } }) => void
  onValueChange?: (value: boolean) => void
  disabled?: boolean
  // content props
  label?: ReactNode
  error?: string
  helper?: string
}
const Switch = ({
  id,
  className,
  labelClassName,
  // function props
  name,
  value,
  onChange = () => undefined,
  onValueChange = () => undefined,
  disabled = false,
  // content props
  label,
  error,
  helper,
}: SwitchProps): JSX.Element => {
  return !!label ? (
    <ChakraFormControl className={className} isInvalid={!!error}>
      <div className="flex flex-row items-center">
        <ChakraSwitch
          id={id}
          name={name}
          checked={value}
          isChecked={value}
          onChange={(e) => {
            onValueChange(e.target.checked)
            onChange({ target: { name, value: e.target.checked } })
          }}
          colorScheme="purple"
          isInvalid={!!error}
          isDisabled={disabled}
        />
        <ChakraFormLabel
          htmlFor={id}
          className={cn('!my-auto ml-2', labelClassName)}
        >
          {label}
        </ChakraFormLabel>
      </div>
      {helper ? (
        <ChakraFormHelperText>{helper}</ChakraFormHelperText>
      ) : error ? (
        <ChakraFormErrorMessage>{error}</ChakraFormErrorMessage>
      ) : null}
    </ChakraFormControl>
  ) : (
    <ChakraSwitch
      id={id}
      className={className}
      name={name}
      checked={value}
      isChecked={value}
      onChange={(e) => {
        onValueChange(e.target.checked)
        onChange({ target: { name, value: e.target.checked } })
      }}
      colorScheme="purple"
      isInvalid={!!error}
      isDisabled={disabled}
    />
  )
}
export default Switch
