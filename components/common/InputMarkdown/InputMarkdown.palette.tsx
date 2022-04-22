import { useState } from 'react'

import InputMarkdown from '.'

const InputMarkdownPalette = () => {
  const [value, setValue] = useState<string>('')
  return (
    <div>
      <InputMarkdown
        value={value}
        onValueChange={setValue}
        label="This is a label"
        helper="This is helper text"
      />
    </div>
  )
}
export default InputMarkdownPalette
