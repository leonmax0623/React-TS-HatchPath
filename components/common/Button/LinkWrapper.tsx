import NextLink from 'next/link'
import { PropsWithChildren } from 'react'

type LinkWrapperProps = PropsWithChildren<{
  href?: string
}>
const LinkWrapper = ({ href, children }: LinkWrapperProps) => {
  return href ? (
    <NextLink href={href} passHref={true}>
      {children}
    </NextLink>
  ) : (
    <>{children}</>
  )
}
export default LinkWrapper
