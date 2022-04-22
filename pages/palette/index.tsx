import React, { ReactNode, useState } from 'react'

import palette from 'components/common/palette'

import cn from 'util/classnames'

import PageLayout from 'components/layouts/Page'

const PalettePage = () => {
  const [selected, setSelected] = useState<
    { idx: number; name: string; component: ReactNode } | undefined
  >()

  const SelectedComponent = selected?.component

  return (
    <PageLayout
      title="Component palette"
      contentClassName="grid grid-cols-12 gap-4 w-full h-full pt-0 px-0"
      isHeaderHidden={true}
      isFooterHidden={true}
      isContentConstrained={false}
      isPagePublic={true}
    >
      <nav className="overflow-auto col-span-3 py-5 max-h-full bg-gray-100">
        <ul>
          {Object.entries(palette)
            .sort(([aName], [bName]) => aName.localeCompare(bName))
            .map(([name, component], idx) => (
              <li
                key={idx}
                className={cn('p-2 cursor-pointer', {
                  'border-t border-gray-300': idx > 0,
                  'text-white bg-purple-600': idx === selected?.idx,
                })}
                role="button"
                onClick={() =>
                  setSelected({
                    idx,
                    name,
                    component,
                  })
                }
              >
                {name}
              </li>
            ))}
        </ul>
      </nav>
      <main className="overflow-auto col-span-9 py-5 px-10 max-h-full">
        {selected && SelectedComponent ? (
          <>
            <h1 className="mb-10 underline">{selected.name}</h1>
            {selected.component}
          </>
        ) : (
          <h1>Select a component to show</h1>
        )}
      </main>
    </PageLayout>
  )
}
export default PalettePage
