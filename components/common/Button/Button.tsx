import { MouseEvent, PropsWithChildren, useMemo } from 'react'

import { Button as ChakraButton, Link as ChakraLink } from '@chakra-ui/react'
import { forwardRef } from '@chakra-ui/system'

import { CommonProps } from 'types/common'

import Icon, { IconProps } from '../Icon'
import {
  ButtonColorType,
  ButtonSizeType,
  ButtonVariantType,
  getButtonVariant,
  getColorScheme,
} from './buttonMapping'
import LinkWrapper from './LinkWrapper'

export type ButtonProps = PropsWithChildren<
  CommonProps & {
    // function props
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void
    loading?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    href?: string
    target?: '_blank' | '_self'
    // content props
    color?: ButtonColorType
    variant?: ButtonVariantType
    size?: ButtonSizeType
    leftIcon?: IconProps
    rightIcon?: IconProps
  }
>
const Button = forwardRef<ButtonProps, 'button'>(
  (
    {
      id,
      className,
      onClick = () => undefined,
      loading = false,
      disabled = false,
      type = 'button',
      href,
      target = '_self',
      // content props
      color = 'primary',
      variant = 'default',
      size = 'md',
      leftIcon,
      rightIcon,
      children,
    }: ButtonProps,
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
      <LinkWrapper href={href}>
        <ChakraButton
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
          leftIcon={leftIcon ? <Icon {...leftIcon} /> : undefined}
          rightIcon={rightIcon ? <Icon {...rightIcon} /> : undefined}
          type={type}
          {...hrefProps}
        >
          {children}
        </ChakraButton>
      </LinkWrapper>
    )
  },
)
export default Button
