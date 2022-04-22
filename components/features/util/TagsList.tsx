import Tag from 'components/common/Tag'

import cn from 'util/classnames'

import { CommonProps } from 'types/common'

type TagsListProps = CommonProps & {
  tagClassName?: string
  tagLabelClassName?: string
  tags: string[]
  size?: 'sm' | 'md' | 'lg'
}
const TagsList = ({
  id,
  className,
  tagClassName,
  tagLabelClassName,
  tags,
  size = 'md',
}: TagsListProps) => {
  return (
    <ul id={id} className={cn('flex flex-row flex-wrap gap-2', className)}>
      {tags.map((tag, idx) => (
        <Tag
          key={idx}
          className={tagClassName}
          labelClassName={tagLabelClassName}
          label={tag}
          size={size}
        />
      ))}
    </ul>
  )
}
export default TagsList
