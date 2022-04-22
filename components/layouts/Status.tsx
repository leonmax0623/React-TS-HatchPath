import Button from 'components/common/Button'

import cn from 'util/classnames'

import { CommonProps } from 'types/common'

type StatusLayoutProps = CommonProps & {
  title?: string
  description?: string
  button?: {
    href?: string
    text?: string
    loading?: boolean
    onClick?: () => void
  }
}
const StatusLayout = ({
  id,
  className,
  title,
  description,
  button: link,
}: StatusLayoutProps) => {
  return (
    <div id={id} className={cn('flex flex-col w-100 text-center', className)}>
      <h1>{title}</h1>
      <p className="mt-2">{description}</p>
      {link && (
        <Button
          className="mt-7 w-full"
          href={link.href}
          loading={link.loading}
          onClick={() => {
            if (link.onClick) {
              link.onClick()
            }
          }}
        >
          {link.text}
        </Button>
      )}
    </div>
  )
}

export default StatusLayout
