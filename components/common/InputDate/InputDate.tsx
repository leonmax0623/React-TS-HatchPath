import { createRef, useCallback, useEffect, useState } from 'react'

import dayjs from 'dayjs'

import cn from 'util/classnames'

import { CommonProps } from 'types/common'

import InputText from '../InputText'
import { InputWrapperProps } from '../InputWrapper'
import Popover from '../Popover'
import DatePicker from './DatePicker'

type InputDateProps = CommonProps &
  InputWrapperProps & {
    inputClassName?: string
    name?: string
    value?: Date
    onChange?: (e: { target: { name?: string; value: Date } }) => void
    onValueChange?: (value: Date) => void
    onBlur?: (e: { target: { name?: string } }) => void
    showShortcuts?: boolean
    disabled?: boolean
    minDate?: Date
    maxDate?: Date
    unavailableDates?: Date[]
  }
const InputDate = ({
  id,
  inputClassName,
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
  showShortcuts = true,
  disabled = false,
  minDate,
  maxDate,
  unavailableDates,
}: InputDateProps): JSX.Element => {
  const inputRef = createRef<HTMLInputElement>()
  const popoverRef = createRef<HTMLDivElement>()

  const [edit, setEdit] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    setEdit(dayjs(value).format('YYYY/MM/DD'))
  }, [value])

  const handleChange = useCallback(
    (date: Date) => {
      onValueChange(date)
      onChange({ target: { name, value: date } })
    },
    [onChange, onValueChange, name],
  )
  const handleSubmit = useCallback(() => {
    const date = dayjs(edit, 'YYYY/MM/DD', true)
    if (date.isValid() && !date.isSame(value, 'day')) {
      handleChange(date.startOf('day').toDate())
    } else {
      setEdit(dayjs(value).format('YYYY/MM/DD'))
    }
  }, [value, edit, handleChange])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleClickOutside(event: any) {
      if (
        !popoverRef?.current?.contains(event.target) &&
        !inputRef?.current?.contains(event.target)
      ) {
        setOpen(false)
        onBlur({ target: { name } })
      }
    }

    window.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
    }
  }, [inputRef, popoverRef, onBlur, name])

  return (
    <Popover
      className="w-180"
      contentClassName="bg-white"
      open={open}
      content={
        <div className="w-full h-full" ref={popoverRef}>
          <DatePicker
            value={value}
            onValueChange={(next) => {
              handleChange(next)
              setOpen(false)
            }}
            showShortcuts={showShortcuts}
            minDate={minDate}
            maxDate={maxDate}
            unavailableDates={unavailableDates}
          />
        </div>
      }
      autoFocus={false}
      returnFocus={false}
    >
      <InputText
        id={id}
        className={cn(className, inputClassName)}
        label={label}
        value={edit}
        onValueChange={setEdit}
        onFocus={() => {
          if (!disabled) {
            setOpen(true)
          }
        }}
        onBlur={handleSubmit}
        onEnter={handleSubmit}
        helper={helper}
        error={error}
        rightIcon={{
          className: cn({ '!cursor-not-allowed': disabled }),
          icon: 'calendar-alt',
          onClick: () => {
            if (!disabled) {
              setOpen(true)
            }
          },
        }}
        disabled={disabled}
        ref={inputRef}
      />
    </Popover>
  )
}
export default InputDate
