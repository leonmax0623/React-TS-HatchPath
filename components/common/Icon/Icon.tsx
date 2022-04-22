import '@fortawesome/fontawesome-svg-core/styles.css'

import { forwardRef, useMemo } from 'react'

import { IconName, library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import cn from 'util/classnames'

import { CommonProps } from 'types/common'

export type { IconName } from '@fortawesome/fontawesome-svg-core'

export const initIcons = () => {
  library.add(far)
  library.add(fab)
}
export type IconSizeType =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
export type IconProps = CommonProps & {
  icon: IconName
  size?: IconSizeType
  onClick?: () => void
  variant?: 'default' | 'brand'
}
const Icon = forwardRef(
  (
    {
      id,
      className,
      icon,
      size = 'sm',
      variant = 'default',
      onClick,
    }: IconProps,
    ref,
  ) => {
    const iconSize = useMemo(() => {
      switch (size) {
        case 'xs':
          return 'xs'
        case 'sm':
          return 'sm'
        case 'md':
          return 'lg'
        case 'lg':
          return '2x'
        case 'xl':
          return '3x'
        case '2xl':
          return '4x'
        case '3xl':
          return '5x'
        case '4xl':
          return '6x'
        case '5xl':
          return '7x'
        default:
          return 'lg'
      }
    }, [size])

    return (
      <FontAwesomeIcon
        id={id}
        className={cn({ 'cursor-pointer': !!onClick }, className)}
        forwardedRef={ref}
        icon={[variant === 'brand' ? 'fab' : 'far', icon]}
        size={iconSize}
        role={!!onClick ? 'button' : undefined}
        onClick={onClick || undefined}
      />
    )
  },
)
Icon.displayName = 'Icon'
export default Icon
