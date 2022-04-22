import { TooltipPlacementType } from './Tooltip'

import Tooltip from '.'

const DIRECTIONS: TooltipPlacementType[] = ['top', 'bottom', 'left', 'right']

const TooltipPalette = () => {
  return (
    <div className="flex flex-col space-y-4">
      {DIRECTIONS.map((direction, idx) => (
        <Tooltip key={idx} label="Tooltip" placement={direction}>
          <p className="mr-auto">{direction}</p>
        </Tooltip>
      ))}
    </div>
  )
}
export default TooltipPalette
