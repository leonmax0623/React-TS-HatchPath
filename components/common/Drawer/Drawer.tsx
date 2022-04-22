import { PropsWithChildren, ReactNode } from 'react'

import {
  Drawer as ChakraDrawer,
  DrawerBody as ChakraDrawerBody,
  DrawerFooter as ChakraDrawerFooter,
  DrawerHeader as ChakraDrawerHeader,
  DrawerOverlay as ChakraDrawerOverlay,
  DrawerContent as ChakraDrawerContent,
  DrawerCloseButton as ChakraDrawerCloseButton,
} from '@chakra-ui/react'

import cn from 'util/classnames'

import { CommonProps } from 'types/common'

export type DrawerSizeType = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
export type DrawerDirectionType = 'left' | 'right' | 'top' | 'bottom'
type DrawerProps = PropsWithChildren<
  CommonProps & {
    headerClassName?: string
    footerClassName?: string
    bodyClassName?: string
    // function props
    open?: boolean
    onClose?: () => void
    // content props
    showCloseButton?: boolean
    header?: ReactNode
    footer?: ReactNode
    size?: DrawerSizeType
    direction?: DrawerDirectionType
  }
>
const Drawer = ({
  id,
  className,
  headerClassName,
  footerClassName,
  bodyClassName,
  // function props
  open = false,
  onClose = () => undefined,
  // content props
  showCloseButton,
  header,
  footer,
  size = 'md',
  direction = 'right',
  children,
}: DrawerProps): JSX.Element => {
  return (
    <ChakraDrawer
      id={id}
      isOpen={open}
      onClose={onClose}
      size={size}
      placement={direction}
    >
      <ChakraDrawerOverlay />
      <ChakraDrawerContent className={className}>
        {showCloseButton && <ChakraDrawerCloseButton />}
        {header && (
          <ChakraDrawerHeader className={headerClassName}>
            {header}
          </ChakraDrawerHeader>
        )}
        <ChakraDrawerBody className={bodyClassName}>
          {children}
        </ChakraDrawerBody>
        {footer && (
          <ChakraDrawerFooter className={cn('flex flex-row', footerClassName)}>
            {footer}
          </ChakraDrawerFooter>
        )}
      </ChakraDrawerContent>
    </ChakraDrawer>
  )
}
export default Drawer
