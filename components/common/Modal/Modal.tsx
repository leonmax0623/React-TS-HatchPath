import { PropsWithChildren, ReactNode } from 'react'

import {
  Modal as ChakraModal,
  ModalOverlay as ChakraModalOverlay,
  ModalContent as ChakraModalContent,
  ModalHeader as ChakraModalHeader,
  ModalFooter as ChakraModalFooter,
  ModalBody as ChakraModalBody,
  ModalCloseButton as ChakraModalCloseButton,
} from '@chakra-ui/react'

import cn from 'util/classnames'

import { CommonProps } from 'types/common'

export type ModalSizeType = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type ModalProps = CommonProps & {
  headerClassName?: string
  footerClassName?: string
  open?: boolean
  onClose?: () => void
  header?: ReactNode
  footer?: ReactNode
  size?: ModalSizeType
}
const Modal = ({
  id,
  className,
  headerClassName,
  footerClassName,
  open = false,
  onClose = () => undefined,
  header,
  footer,
  size,
  children,
}: PropsWithChildren<ModalProps>): JSX.Element => {
  return (
    <ChakraModal id={id} isOpen={open} onClose={onClose} size={size}>
      <ChakraModalOverlay />
      <ChakraModalContent>
        {!!header && (
          <ChakraModalHeader className={headerClassName}>
            {header}
          </ChakraModalHeader>
        )}
        <ChakraModalCloseButton />
        <ChakraModalBody className={cn({ 'mb-4': !footer }, className)}>
          {children}
        </ChakraModalBody>
        {!!footer && (
          <ChakraModalFooter className={cn('flex flex-row', footerClassName)}>
            {footer}
          </ChakraModalFooter>
        )}
      </ChakraModalContent>
    </ChakraModal>
  )
}
export default Modal
