import { ReactNode } from 'react'

import {
  Accordion as ChakraAccordion,
  AccordionItem as ChakraAccordionItem,
  AccordionButton as ChakraAccordionButton,
  AccordionPanel as ChakraAccordionPanel,
  AccordionIcon as ChakraAccordionIcon,
} from '@chakra-ui/react'

import cn from 'util/classnames'

import { CommonProps } from 'types/common'

export type AccordionItemType = {
  label: ReactNode
  content: ReactNode
}
type AccordionProps = CommonProps & {
  headerClassName?: string
  labelClassName?: string
  iconClassName?: string
  contentClassName?: string
  items: AccordionItemType[]
}
const Accordion = ({
  id,
  className,
  headerClassName,
  labelClassName,
  iconClassName,
  contentClassName,
  items,
}: AccordionProps) => {
  return (
    <ChakraAccordion id={id} className={className} allowToggle={true}>
      {items.map(({ label, content }, idx) => (
        <ChakraAccordionItem key={idx}>
          <ChakraAccordionButton
            className={cn(
              'flex flex-row justify-between items-center',
              headerClassName,
            )}
          >
            <div className={cn('text-md font-bold', labelClassName)}>
              {label}
            </div>
            <ChakraAccordionIcon className={iconClassName} />
          </ChakraAccordionButton>
          <ChakraAccordionPanel className={contentClassName}>
            {content}
          </ChakraAccordionPanel>
        </ChakraAccordionItem>
      ))}
    </ChakraAccordion>
  )
}
export default Accordion
