import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import cn from 'util/classnames'

import { CommonProps } from 'types/common'

type MarkdownProps = Omit<CommonProps, 'id'> & {
  value?: string
}
const Markdown = ({ className, value = '' }: MarkdownProps) => {
  return (
    <ReactMarkdown
      className={cn('max-w-full text-gray-900 prose', className)}
      remarkPlugins={[remarkGfm]}
    >
      {value}
    </ReactMarkdown>
  )
}
export default Markdown
