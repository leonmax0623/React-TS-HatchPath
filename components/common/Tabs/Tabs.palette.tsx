import { useState } from 'react'

import { TabsSizeType } from './Tabs'

import Tabs from '.'

const SIZES: TabsSizeType[] = ['sm', 'md', 'lg']

const TabsPalette = () => {
  const [tab, setTab] = useState<number>(0)
  return (
    <div className="flex flex-col items-start space-y-4">
      {SIZES.map((size, idx) => (
        <Tabs
          key={idx}
          size={size}
          items={['Tab 1', 'Tab 2']}
          value={tab}
          onValueChange={setTab}
        />
      ))}
    </div>
  )
}
export default TabsPalette
