import dynamic from 'next/dynamic'
import { FocusEvent, useMemo } from 'react'

import ReactDOMServer from 'react-dom/server'

import 'easymde/dist/easymde.min.css'
import { CommonProps } from 'types/common'

import InputWrapper, { InputWrapperProps } from '../InputWrapper'
import Markdown from '../Markdown'

const SimpleMDE = dynamic<Record<string, unknown>>(
  () => import('react-simplemde-editor').then((mod) => mod.SimpleMdeReact),
  {
    ssr: false,
  },
)

type InputMarkdownProps = CommonProps &
  InputWrapperProps & {
    inputClassName?: string
    name?: string
    value?: string
    onChange?: (e: { target: { name?: string; value?: string } }) => void
    onValueChange?: (value: string) => void
    onBlur?: (e: FocusEvent<HTMLDivElement>) => void
    showToolbar?: boolean
    maxHeight?: string
  }
const InputMarkdown = ({
  id,
  className,
  inputClassName,
  name,
  value = '',
  onChange = () => undefined,
  onValueChange = () => undefined,
  onBlur = () => undefined,
  label,
  helper,
  error,
  showToolbar = true,
  maxHeight,
}: InputMarkdownProps) => {
  const options = useMemo(
    () => ({
      spellChecker: false,
      sideBySideFullscreen: false,
      previewRender: (text: string) =>
        ReactDOMServer.renderToString(<Markdown value={text} />),
      lineNumbers: false,
      status: false,
      toolbar: showToolbar
        ? [
            'bold',
            'italic',
            'strikethrough',
            'heading',
            '|',
            'code',
            'quote',
            'link',
            '|',
            'unordered-list',
            'ordered-list',
            'horizontal-rule',
            '|',
            'preview',
            'side-by-side',
            'guide',
          ]
        : false,
      maxHeight,
    }),
    [showToolbar, maxHeight],
  )

  return (
    <InputWrapper
      className={className}
      label={label}
      helper={helper}
      error={error}
    >
      <SimpleMDE
        id={id}
        className={inputClassName}
        value={value}
        onChange={(next: string) => {
          onValueChange(next)
          onChange({ target: { name, value: next } })
        }}
        onBlur={onBlur}
        options={options}
      />
    </InputWrapper>
  )
}
export default InputMarkdown
