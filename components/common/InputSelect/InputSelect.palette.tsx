import { range } from 'util/list'

import { InputSelectOptionType } from './InputSelect'

import InputSelect from '.'

const OPTIONS: InputSelectOptionType<string>[] = range(0, 4).map((i) => ({
  label: `Option ${i}`,
  value: i.toString(),
}))
const InputSelectPalette = () => {
  return (
    <div className="flex flex-col space-y-4">
      <InputSelect
        options={OPTIONS}
        label="label goes here"
        helper="helper goes here"
      />
      <InputSelect
        options={OPTIONS}
        label="label goes here"
        helper="helper goes here"
      />
    </div>
  )
}
export default InputSelectPalette
