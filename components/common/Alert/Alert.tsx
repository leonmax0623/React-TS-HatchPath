import { ReactNode, useMemo } from 'react'

import {
  Alert as ChakraAlert,
  AlertDescription as ChakraAlertDescription,
  AlertTitle as ChakraAlertTitle,
  AlertIcon as ChakraIcon,
} from '@chakra-ui/react'

import { CommonProps } from 'types/common'

export type AlertType = 'error' | 'warning' | 'info' | 'success'
export type AlertVariantType = 'default' | 'heavy' | 'border'
type AlertProps = CommonProps & {
  type?: AlertType
  variant?: AlertVariantType
  title?: string
  description?: ReactNode
}
const Alert = ({
  id,
  className,
  type = 'error',
  variant = 'default',
  title,
  description,
}: AlertProps): JSX.Element => {
  const alertVariant = useMemo(() => {
    switch (variant) {
      case 'default':
        return 'subtle'
      case 'heavy':
        return 'solid'
      case 'border':
        return 'left-accent'
    }
  }, [variant])

  return (
    <ChakraAlert
      id={id}
      className={className}
      status={type}
      variant={alertVariant}
    >
      <ChakraIcon />
      <div className="flex flex-col">
        <ChakraAlertTitle>{title}</ChakraAlertTitle>
        <ChakraAlertDescription>{description}</ChakraAlertDescription>
      </div>
    </ChakraAlert>
  )
}
export default Alert
