import { ReactNode } from 'react'

import {
  FormControl as ChakraFormControl,
  FormLabel as ChakraFormLabel,
  FormErrorMessage as ChakraFormErrorMessage,
  FormHelperText as ChakraFormHelperText,
  Checkbox as ChakraCheckbox,
} from '@chakra-ui/react'

import { CommonProps } from 'types/common'

type CheckboxProps = CommonProps & {
  // function props
  name?: string
  value?: boolean
  onChange?: (e: { target: { name?: string; value?: boolean } }) => void
  onValueChange?: (value: boolean) => void
  // content props
  label?: ReactNode
  error?: string
  helper?: string
}
const Checkbox = ({
  id,
  className,
  // function props
  name,
  value,
  onChange = () => undefined,
  onValueChange = () => undefined,
  // content props
  label,
  error,
  helper,
}: CheckboxProps): JSX.Element => {
  return (
    <ChakraFormControl className={className} isInvalid={!!error}>
      <div className="flex flex-row items-center">
        <ChakraCheckbox
          id={id}
          name={name}
          checked={value}
          isChecked={value}
          onChange={(e) => {
            onValueChange(e.target.checked)
            onChange({ target: { name, value: e.target.checked } })
          }}
          isInvalid={!!error}
          colorScheme="purple"
        >
          <ChakraFormLabel htmlFor={id} className="!my-auto">
            {label}
          </ChakraFormLabel>
        </ChakraCheckbox>
      </div>
      {helper ? (
        <ChakraFormHelperText>{helper}</ChakraFormHelperText>
      ) : error ? (
        <ChakraFormErrorMessage>{error}</ChakraFormErrorMessage>
      ) : null}
    </ChakraFormControl>
  )
}
export default Checkbox
