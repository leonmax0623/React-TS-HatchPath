import { range } from 'util/list'

import { AccordionItemType } from './Accordion'

import Accordion from '.'

const ITEMS: AccordionItemType[] = range(0, 4).map((i) => ({
  label: `Item ${i}`,
  content: <p>Content for item {i}</p>,
}))
const AccordionPalette = () => {
  return (
    <div className="flex flex-col space-y-8">
      <Accordion items={ITEMS} />
    </div>
  )
}
export default AccordionPalette
