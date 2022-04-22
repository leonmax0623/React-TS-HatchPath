import { ReactNode } from 'react'

import cn from 'util/classnames'

import { CommonProps } from 'types/common'

type ListProps = CommonProps & {
  items: ReactNode[]
}
const List = ({ id, className, items }: ListProps) => {
  return (
    <ul id={id} className={cn('flex flex-col', className)}>
      {items.map((item, idx) => (
        <li key={idx} className="py-1">
          {item}
        </li>
      ))}
    </ul>
  )
}
export default List
