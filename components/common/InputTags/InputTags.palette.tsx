import { useState } from 'react'

import { range } from 'util/list'

import InputTags from '.'

const OPTIONS: string[] = range(0, 50).map((idx) => `Option ${idx}`)
const InputTagsPalette = () => {
  const [tags, setTags] = useState<string[]>([])
  return (
    <div className="flex flex-col space-y-12">
      <InputTags
        label="label goes here"
        error="error goes here"
        value={tags}
        onValueChange={setTags}
        options={OPTIONS}
      />
    </div>
  )
}
export default InputTagsPalette
