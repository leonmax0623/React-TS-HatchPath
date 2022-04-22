import { useCallback, useState } from 'react'

import Button, { ButtonProps } from 'components/common/Button'
import Modal from 'components/common/Modal'

import cn from 'util/classnames'

import { CommonProps } from 'types/common'

type ConfirmModalProps = CommonProps & {
  open?: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  title: string
  message: string
  confirmProps: ButtonProps
}
const ConfirmModal = ({
  id,
  className,
  open = false,
  onClose = () => undefined,
  onConfirm = async () => undefined,
  title,
  message,
  confirmProps,
}: ConfirmModalProps) => {
  const [loading, setLoading] = useState<boolean>(false)

  const handleConfirm = useCallback(async () => {
    setLoading(true)
    await onConfirm()
    setLoading(false)
  }, [onConfirm])

  return (
    <Modal
      id={id}
      className={cn(className)}
      footerClassName="flex flex-row items-center gap-x-2"
      open={open}
      onClose={onClose}
      header={title}
      footer={
        <>
          <Button onClick={onClose} variant="text" color="secondary">
            Cancel
          </Button>
          <Button loading={loading} onClick={handleConfirm} {...confirmProps}>
            Confirm
          </Button>
        </>
      }
    >
      <p>{message}</p>
    </Modal>
  )
}
export default ConfirmModal
