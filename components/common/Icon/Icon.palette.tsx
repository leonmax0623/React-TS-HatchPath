import { IconSizeType } from './Icon'

import Icon from '.'

const SIZES: IconSizeType[] = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
]

const IconPalette = () => {
  return (
    <div className="flex flex-col space-y-4">
      {SIZES.map((size, idx) => (
        <div key={idx} className="flex flex-row items-center">
          <h2 className="w-12 text-md">{size}: </h2>
          <Icon icon="question" size={size} />
        </div>
      ))}
    </div>
  )
}
export default IconPalette
