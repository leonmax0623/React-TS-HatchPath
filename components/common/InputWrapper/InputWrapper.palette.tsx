import { InputWrapperSizeType } from './InputWrapper'

import InputWrapper from '.'

const SIZES: InputWrapperSizeType[] = ['xs', 'sm', 'md', 'lg']
const InputWrapperPalette = () => {
  return (
    <div className="flex flex-col space-y-4">
      {SIZES.map((size, idx) => (
        <div key={idx} className="flex flex-col space-y-4">
          <h2 className="text-lg font-light">{size}</h2>
          <InputWrapper
            label="label goes here"
            helper="helper goes here"
            size={size}
          >
            <></>
          </InputWrapper>
          <InputWrapper
            label="label goes here"
            helper="helper goes here"
            error="error goes here"
            size={size}
          >
            <></>
          </InputWrapper>
        </div>
      ))}
    </div>
  )
}
export default InputWrapperPalette
