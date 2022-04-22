import { useState } from 'react'

import InputDate, { DatePicker } from '.'

const InputDatePalette = () => {
  const [date, setDate] = useState<Date>(new Date())
  return (
    <div className="flex flex-col space-y-12">
      <InputDate
        label="label goes here"
        helper="helper goes here"
        value={date}
        onValueChange={setDate}
      />
      <DatePicker value={date} onValueChange={setDate} />
    </div>
  )
}
export default InputDatePalette
