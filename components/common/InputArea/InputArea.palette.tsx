import { InputAreaSizeProps } from './InputArea'

import InputArea from '.'

const SIZES: InputAreaSizeProps[] = ['xs', 'sm', 'md', 'lg']
const InputAreaPalette = () => {
  return (
    <div className="flex flex-col space-y-12">
      {SIZES.map((size, idx) => (
        <div key={idx} className="flex flex-col space-y-4">
          <h2 className="text-lg font-light">{size}</h2>
          <InputArea
            key={idx}
            size={size}
            label="label goes here"
            helper="helper goes here"
          />
          <InputArea
            key={idx}
            size={size}
            label="label goes here"
            error="error goes here"
          />
        </div>
      ))}
    </div>
  )
}
export default InputAreaPalette
