import { useMemo } from 'react'

import {
  IconButton as ChakraIconButton,
  Link as ChakraLink,
} from '@chakra-ui/react'
import { forwardRef } from '@chakra-ui/system'

import Icon, { IconProps } from '../Icon'
import Tooltip, { TooltipProps } from '../Tooltip'
import { ButtonProps } from './Button'
import { getButtonVariant, getColorScheme } from './buttonMapping'
import LinkWrapper from './LinkWrapper'

type IconButtonProps = Omit<
  ButtonProps,
  'leftIcon' | 'rightIcon' | 'children'
> & {
  icon: IconProps
  tooltip?: TooltipProps
  ariaLabel: string
}
const IconButton = forwardRef<IconButtonProps, 'button'>(
  (
    {
      id,
      className,
      onClick = () => undefined,
      loading = false,
      disabled = false,
      href,
      target = '_self',
      // content props
      color = 'primary',
      variant = 'default',
      size = 'md',
      icon,
      tooltip,
      ariaLabel,
    }: IconButtonProps,
    ref,
  ) => {
    const colorScheme = useMemo(() => getColorScheme(color), [color])
    const buttonVariant = useMemo(() => getButtonVariant(variant), [variant])
    const hrefProps = useMemo(() => {
      if (href) {
        return {
          href,
          isExternal: target === '_blank',
        }
      } else {
        return {}
      }
    }, [href, target])

    return (
      <Tooltip wrapTrigger={true} {...tooltip}>
        <LinkWrapper href={href}>
          <ChakraIconButton
            ref={ref}
            id={id}
            as={href ? ChakraLink : undefined}
            className={className}
            onClick={onClick}
            isLoading={loading}
            isDisabled={disabled}
            colorScheme={colorScheme}
            variant={buttonVariant}
            size={size}
            icon={<Icon {...icon} />}
            aria-label={ariaLabel}
            {...hrefProps}
          />
        </LinkWrapper>
      </Tooltip>
    )
  },
)
export default IconButton
