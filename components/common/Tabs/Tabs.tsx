import {
  Tabs as ChakraTabs,
  TabList as ChakraTabList,
  Tab as ChakraTab,
} from '@chakra-ui/react'

import { CommonProps } from 'types/common'

export type TabsSizeType = 'xs' | 'sm' | 'md' | 'lg'
type TabsProps = CommonProps & {
  value?: number
  onValueChange?: (value: number) => void
  items: string[]
  size?: TabsSizeType
}
const Tabs = ({
  id,
  className,
  value,
  onValueChange,
  items,
  size,
}: TabsProps): JSX.Element => {
  return (
    <ChakraTabs
      id={id}
      className={className}
      index={value}
      onChange={onValueChange}
      size={size}
    >
      <ChakraTabList>
        {items.map((option, idx) => (
          <ChakraTab key={idx}>{option}</ChakraTab>
        ))}
      </ChakraTabList>
    </ChakraTabs>
  )
}
export default Tabs
