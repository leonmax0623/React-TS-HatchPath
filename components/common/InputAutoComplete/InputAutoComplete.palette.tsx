import { useState } from 'react'

import { range } from 'util/list'

import InputAutoComplete from '.'

const OPTIONS: string[] = range(0, 50).map((idx) => `Option ${idx}`)
const InputAutoCompletePalette = () => {
  const [value, setValue] = useState<string>('')
  return (
    <div className="flex flex-col space-y-4">
      <InputAutoComplete
        label="label goes here"
        helper="helper goes here"
        options={OPTIONS}
        value={value}
        onValueChange={setValue}
      />
    </div>
  )
}
export default InputAutoCompletePalette
