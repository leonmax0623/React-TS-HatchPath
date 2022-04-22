import { TagSizeType } from './Tag'

import Tag from '.'

const SIZES: TagSizeType[] = ['sm', 'md', 'lg']

const TagPalette = () => {
  return (
    <div className="flex flex-col items-start space-y-4">
      {SIZES.map((size, idx) => (
        <Tag key={idx} size={size} label={size} />
      ))}
    </div>
  )
}
export default TagPalette
