import { useState } from 'react'

import InputTimeRange, {
  defaultTimeRange,
  TimeRangeType,
} from './InputTimeRange'

const InputTimeRangePalette = () => {
  const [range, setRange] = useState<TimeRangeType>(defaultTimeRange)
  return (
    <div className="flex flex-col space-y-12">
      <InputTimeRange
        label="label goes here"
        helper="helper goes here"
        value={range}
        onValueChange={setRange}
      />
    </div>
  )
}
export default InputTimeRangePalette
