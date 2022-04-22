import { useState } from 'react'

import { ModalSizeType } from './Modal'

import Modal from '.'

const SIZES: ModalSizeType[] = ['xs', 'sm', 'md', 'lg', 'xl']
const ModalPalette = () => {
  const [size, setSize] = useState<ModalSizeType>('md')
  const [open, setOpen] = useState<boolean>(false)
  return (
    <>
      <div className="flex flex-col space-y-4">
        {SIZES.map((size, idx) => (
          <button
            key={idx}
            className="p-2 bg-blue-100 hover:bg-blue-200"
            onClick={() => {
              setSize(size)
              setOpen(true)
            }}
          >
            Open {size} modal
          </button>
        ))}
      </div>
      <Modal
        header="Modal title goes here"
        open={!!open}
        size={size}
        onClose={() => setOpen(false)}
      >
        <p>Modal content goes here</p>
      </Modal>
    </>
  )
}
export default ModalPalette
