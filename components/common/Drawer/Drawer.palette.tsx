import { useState } from 'react'

import { DrawerDirectionType, DrawerSizeType } from './Drawer'

import Drawer from '.'

const SIZES: DrawerSizeType[] = ['xs', 'sm', 'md', 'lg', 'xl']
const DIRECTIONS: DrawerDirectionType[] = ['left', 'right', 'top', 'bottom']
const DrawerPalette = () => {
  const [config, setConfig] = useState<{
    size: DrawerSizeType
    direction: DrawerDirectionType
  }>({
    size: 'md',
    direction: 'right',
  })
  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      <div className="flex flex-col space-y-4">
        {SIZES.map((size, sizeIdx) => (
          <div key={sizeIdx} className="flex flex-row space-x-2">
            {DIRECTIONS.map((direction, directionIdx) => (
              <button
                key={directionIdx}
                className="p-2 bg-blue-100 hover:bg-blue-200 rounded"
                onClick={() => {
                  setConfig({ size, direction })
                  setOpen(true)
                }}
              >
                Open {size} modal coming from {direction}
              </button>
            ))}
          </div>
        ))}
      </div>
      <Drawer
        header="Drawer title goes here"
        open={open}
        size={config?.size}
        direction={config?.direction}
        onClose={() => setOpen(false)}
      >
        <p>Drawer content goes here</p>
      </Drawer>
    </>
  )
}
export default DrawerPalette
