import { PropsWithChildren } from 'react'

import cn from 'util/classnames'

import { CommonProps } from 'types/common'

type SectionLayoutProps = PropsWithChildren<
  CommonProps & {
    titleClassName?: string
    title: string
  }
>
const SectionLayout = ({
  id,
  className,
  titleClassName,
  title,
  children,
}: SectionLayoutProps) => {
  return (
    <section id={id} className={cn(className)}>
      <h2 className={cn('mb-2 font-semibold', titleClassName)}>{title}</h2>
      {children}
    </section>
  )
}
export default SectionLayout
