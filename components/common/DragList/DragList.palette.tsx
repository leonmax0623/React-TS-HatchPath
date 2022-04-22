import { useState } from 'react'

import { range } from 'util/list'

import { DragListItemType } from './DragList'

import DragList from '.'

const ITEMS: DragListItemType<undefined>[] = range(0, 10).map((i) => ({
  id: i.toString(),
  content: `item ${i}`,
}))
const DragListPalette = () => {
  const [items, setItems] = useState<DragListItemType<undefined>[]>(ITEMS)
  return <DragList items={items} onValueChange={setItems} />
}
export default DragListPalette
