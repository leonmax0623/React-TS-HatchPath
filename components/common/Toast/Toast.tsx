import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
} from 'react'

import { useToast as useChakraToast } from '@chakra-ui/react'

import { GENERIC_ERROR } from 'util/constants'

export type ToastType = 'info' | 'success' | 'error'
type ToastContextTypes = {
  toast: (config: {
    title?: string
    description?: string
    type?: ToastType
  }) => void
  error: (title?: string, message?: string) => void
}
export const ToastContext = createContext<ToastContextTypes>({
  toast: () => undefined,
  error: () => undefined,
})

export const ToastProvider = ({
  children,
}: PropsWithChildren<Record<never, never>>): JSX.Element => {
  const chakraToast = useChakraToast()

  const toast = useCallback(
    ({ title, description, type }) => {
      chakraToast({
        title,
        description,
        status: type || 'info',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      })
    },
    [chakraToast],
  )
  const error = useCallback(
    (title, message) => {
      toast({
        title: title || 'Unexpected error',
        description: message || GENERIC_ERROR,
        type: 'error',
      })
    },
    [toast],
  )

  return (
    <ToastContext.Provider value={{ toast, error }}>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = (): ToastContextTypes => useContext(ToastContext)
