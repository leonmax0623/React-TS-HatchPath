import { PropsWithChildren } from 'react'

import { Tooltip as ChakraTooltip } from '@chakra-ui/react'

import { CommonProps } from 'types/common'

export type TooltipPlacementType = 'top' | 'bottom' | 'left' | 'right'
export type TooltipProps = PropsWithChildren<
  CommonProps & {
    triggerClassName?: string
    label?: string
    placement?: TooltipPlacementType
    wrapTrigger?: boolean
  }
>
const Tooltip = ({
  id,
  className,
  triggerClassName,
  label,
  placement = 'bottom',
  wrapTrigger = false,
  children,
}: TooltipProps) => {
  return label ? (
    <ChakraTooltip
      id={id}
      className={className}
      label={label}
      placement={placement}
      hasArrow={true}
    >
      {wrapTrigger ? (
        <div className={triggerClassName}>{children}</div>
      ) : (
        children
      )}
    </ChakraTooltip>
  ) : (
    <>{children}</>
  )
}
export default Tooltip
