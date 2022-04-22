import { useState } from 'react'

import { range } from 'util/list'

import SelectButton from '.'

const ITEMS = range(0, 4).map((i) => ({
  id: i.toString(),
  content: `Item ${i}`,
}))
const SelectButtonPalette = () => {
  const [value, setValue] = useState<string>('')
  return (
    <div className="flex flex-col">
      <SelectButton items={ITEMS} onValueChange={setValue} value={value} />
    </div>
  )
}
export default SelectButtonPalette
