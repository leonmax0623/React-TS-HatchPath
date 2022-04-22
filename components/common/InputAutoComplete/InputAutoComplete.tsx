import { createRef, useCallback, useEffect, useMemo, useState } from 'react'

import cn from 'util/classnames'
import { equalsIgnoreCase } from 'util/string'

import {
  CommonProps,
  SyntheticBlurEvent,
  SyntheticChangeEvent,
} from 'types/common'

import InputText, { InputTextProps } from '../InputText'
import InputWrapper, { InputWrapperProps } from '../InputWrapper'
import Popover from '../Popover'

type InputAutoCompleteProps = CommonProps &
  InputWrapperProps &
  InputTextProps & {
    onChange?: (e: SyntheticChangeEvent<string>) => void
    onBlur?: (e: SyntheticBlurEvent) => void
    onSelect?: (value: string) => void
    options?: string[]
    loading?: boolean
    keepOpen?: boolean
  }
const InputAutoComplete = ({
  id,
  className,
  // input wrapper props
  label,
  helper,
  error,
  // function props
  name,
  value,
  onChange = () => undefined,
  onValueChange = () => undefined,
  onBlur = () => undefined,
  onEnter = () => undefined,
  onSelect = () => undefined,
  disabled = false,
  options = [],
  loading = false,
  keepOpen = false,
  // style props
  topDecorator,
  size = 'md',
  rightIcon,
}: InputAutoCompleteProps): JSX.Element => {
  const inputRef = createRef<HTMLInputElement>()
  const popoverRef = createRef<HTMLUListElement>()

  const [open, setOpen] = useState<boolean>(false)
  const [candidate, setCandidate] = useState<number | null>(null)

  const handleChange = useCallback(
    (next: string) => {
      onValueChange(next)
      onChange({ target: { name, value: next } })
      if (!keepOpen) {
        setOpen(false)
      }
      onSelect(next)
    },
    [onChange, onValueChange, onSelect, keepOpen, name],
  )

  const onOutsideClick = useCallback(() => {
    if (open) {
      setOpen(false)
      onBlur({ target: { name } })
    }
  }, [onBlur, name, open])
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleClickOutside(event: any) {
      if (
        !popoverRef?.current?.contains(event.target) &&
        !inputRef?.current?.contains(event.target)
      ) {
        onOutsideClick()
      }
    }

    window.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
    }
  }, [inputRef, popoverRef, onOutsideClick])

  const showOptions = useMemo(
    () =>
      options.filter(
        (option) => !value || equalsIgnoreCase(option, value, true),
      ) || [],
    [options, value],
  )

  useEffect(() => {
    setCandidate(null)
  }, [open, showOptions])

  return (
    <InputWrapper label={label} helper={helper} error={error} size={size}>
      <Popover
        contentClassName="bg-white max-h-50 overflow-y-auto"
        content={
          <ul ref={popoverRef}>
            {showOptions.map((option, idx) => (
              <li
                key={idx}
                className={cn(
                  'p-2 rounded',
                  {
                    'text-sm': size === 'sm',
                    'text-md': size === 'md' || size === 'lg',
                  },
                  {
                    'text-white bg-purple-600': equalsIgnoreCase(option, value),
                    'hover:bg-gray-100': !equalsIgnoreCase(option, value),
                    'border-2 border-blue-600':
                      candidate !== null && candidate === idx,
                  },
                )}
                onClick={() => {
                  handleChange(option)
                  setCandidate(idx)
                }}
                role="button"
              >
                {option}
              </li>
            ))}
          </ul>
        }
        showArrow={false}
        matchWidth={true}
        open={open && !loading && showOptions.length > 0}
        autoFocus={false}
        returnFocus={false}
      >
        <InputText
          id={id}
          ref={inputRef}
          className={className}
          name={name}
          value={value}
          onChange={onChange}
          onValueChange={onValueChange}
          onFocus={() => setOpen(true)}
          onBlur={(e) => {
            onBlur(e)
          }}
          onEnter={(e) => {
            if (candidate !== null && options[candidate]) {
              handleChange(options[candidate])
            } else {
              onEnter(e)
            }
          }}
          onUp={() => {
            if (candidate !== null && candidate > 0) {
              setCandidate(candidate - 1)
            }
          }}
          onDown={() => {
            if (candidate !== null && candidate < showOptions.length - 1) {
              setCandidate(candidate + 1)
            } else {
              setCandidate(0)
            }
          }}
          rightIcon={
            loading
              ? {
                  className: 'animate-spin',
                  icon: 'spinner-third',
                }
              : rightIcon
          }
          disabled={disabled || loading}
          topDecorator={topDecorator}
          size={size}
          disableAutoComplete={true}
        />
      </Popover>
    </InputWrapper>
  )
}
export default InputAutoComplete
