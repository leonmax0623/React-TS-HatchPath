import { range } from 'util/list'

import { PopoverItemType } from './PopoverMenu'

import PopoverMenu from '.'

const ITEMS: PopoverItemType<string>[] = range(0, 5).map((idx) => ({
  label: `Option ${idx}`,
  value: idx.toString(),
}))
const PopoverMenuPalette = () => {
  return (
    <div className="flex flex-col space-y-4">
      <PopoverMenu
        items={ITEMS}
        trigger={{
          children: 'Press me',
        }}
      />
    </div>
  )
}
export default PopoverMenuPalette
