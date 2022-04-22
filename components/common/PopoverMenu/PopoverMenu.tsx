import {
  Menu as ChakraMenu,
  MenuButton as ChakraMenuButton,
  MenuList as ChakraMenuList,
  MenuItem as ChakraMenuItem,
  MenuDivider as ChakraMenuDivider,
} from '@chakra-ui/react'

import cn from 'util/classnames'

import { CommonProps } from 'types/common'

import Button, { ButtonProps } from '../Button'
import Icon, { IconProps } from '../Icon'

export type PopoverMenuSizeType = 'xs' | 'sm' | 'md' | 'lg'
export type PopoverItemType<T> = {
  label: string
  value: T
  active?: boolean
  icon?: IconProps
  isDivider?: boolean
}
type PopoverMenuProps<T> = CommonProps & {
  items: PopoverItemType<T>[]
  onSelect?: (value: T) => void
  trigger?: ButtonProps
}
const PopoverMenu = <T,>({
  id,
  className,
  items,
  onSelect = () => undefined,
  trigger,
}: PopoverMenuProps<T>): JSX.Element => {
  return (
    <ChakraMenu id={id}>
      <ChakraMenuButton className={className} as={Button} {...trigger} />
      <ChakraMenuList className="overflow-auto max-h-100">
        {items.map(({ label, value, active, icon, isDivider }, idx) =>
          isDivider ? (
            <ChakraMenuDivider key={idx} />
          ) : (
            <ChakraMenuItem
              key={idx}
              onClick={() => onSelect(value)}
              className={cn(
                'flex flex-row gap-x-2 justify-start items-center',
                {
                  'text-white bg-blue-600': active,
                },
              )}
            >
              {icon && (
                <Icon className={cn('min-w-8', icon.className)} {...icon} />
              )}
              <span>{label}</span>
            </ChakraMenuItem>
          ),
        )}
      </ChakraMenuList>
    </ChakraMenu>
  )
}
export default PopoverMenu
