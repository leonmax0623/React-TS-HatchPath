import { InputTextSizeProps } from './InputText'

import InputText from '.'

const SIZES: InputTextSizeProps[] = ['xs', 'sm', 'md', 'lg']
const InputTextPalette = () => {
  return (
    <div className="flex flex-col space-y-12">
      {SIZES.map((size, idx) => (
        <div key={idx} className="flex flex-col space-y-4">
          <h2 className="text-lg font-light">{size}</h2>
          <InputText
            key={idx}
            size={size}
            label="label goes here"
            helper="helper goes here"
          />
          <InputText
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
export default InputTextPalette
