import React, { PropsWithChildren, ReactNode } from 'react'

import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc'

import cn from 'util/classnames'
import { moveIndex } from 'util/list'

import { CommonProps } from 'types/common'

import Icon from '../Icon'

const DragHandle = SortableHandle(({ className }: { className?: string }) => (
  <Icon icon="grip-vertical" className={cn('cursor-move', className)} />
))

const SortableItem = SortableElement(
  ({
    className,
    handleClassName,
    content,
  }: {
    className?: string
    handleClassName?: string
    content: ReactNode
  }) => (
    <li className={cn('flex flex-row items-center', className)}>
      <DragHandle className={cn('mr-3', handleClassName)} />
      {content}
    </li>
  ),
)

const SortableList = SortableContainer(
  ({ id, className, children }: PropsWithChildren<CommonProps>) => {
    return (
      <ul id={id} className={className}>
        {children}
      </ul>
    )
  },
)

export type DragListItemType<T> = {
  id: string
  content: React.ReactNode
  data?: T
}
type DragListProps<T> = CommonProps & {
  itemClassName?: string
  handleClassName?: string
  items: DragListItemType<T>[]
  onValueChange: (values: DragListItemType<T>[]) => void
}
const DragList = <T,>({
  id,
  className,
  itemClassName,
  handleClassName,
  items,
  onValueChange = () => undefined,
}: DragListProps<T>) => {
  return (
    <SortableList
      id={id}
      className={className}
      onSortEnd={(sort) =>
        onValueChange(moveIndex(items, sort.oldIndex, sort.newIndex))
      }
      useDragHandle={true}
    >
      {items.map((value, index) => (
        <SortableItem
          key={value.id}
          className={itemClassName}
          handleClassName={handleClassName}
          index={index}
          content={value.content}
        />
      ))}
    </SortableList>
  )
}
export default DragList
