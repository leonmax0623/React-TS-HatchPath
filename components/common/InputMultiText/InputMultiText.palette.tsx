import { useState } from 'react'

import InputMultiText from '.'

const InputMultiTextPalette = () => {
  const [tags, setTags] = useState<string[]>([])
  return (
    <div className="flex flex-col space-y-12">
      <InputMultiText
        label="label goes here"
        error="error goes here"
        value={tags}
        onValueChange={setTags}
      />
    </div>
  )
}
export default InputMultiTextPalette
