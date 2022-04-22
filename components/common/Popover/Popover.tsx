import { PropsWithChildren, ReactNode } from 'react'

import {
  Popover as ChakraPopover,
  PopoverTrigger as ChakraPopoverTrigger,
  PopoverContent as ChakraPopoverContent,
  PopoverBody as ChakraPopoverBody,
  PopoverArrow as ChakraPopoverArrow,
} from '@chakra-ui/react'

import cn from 'util/classnames'

import { CommonProps } from 'types/common'

type PopoverProps = PropsWithChildren<
  CommonProps & {
    contentClassName?: string
    // function props
    open?: boolean
    trigger?: 'hover' | 'click'
    autoFocus?: boolean
    returnFocus?: boolean
    // content props
    content: ReactNode
    matchWidth?: boolean
    showArrow?: boolean
  }
>
const Popover = ({
  id,
  className,
  contentClassName,
  // function props
  open,
  trigger,
  autoFocus = true,
  returnFocus = true,
  // content props
  content,
  matchWidth = false,
  showArrow = true,
  children,
}: PopoverProps) => {
  return (
    <ChakraPopover
      id={id}
      isOpen={open}
      trigger={trigger}
      closeOnBlur={open === undefined}
      returnFocusOnClose={returnFocus}
      autoFocus={autoFocus}
      matchWidth={matchWidth}
    >
      <ChakraPopoverTrigger>{children}</ChakraPopoverTrigger>
      <ChakraPopoverContent className={cn('!w-full rounded', className)}>
        {showArrow && <ChakraPopoverArrow />}
        <ChakraPopoverBody className={cn('!w-full rounded', contentClassName)}>
          {content}
        </ChakraPopoverBody>
      </ChakraPopoverContent>
    </ChakraPopover>
  )
}
export default Popover
