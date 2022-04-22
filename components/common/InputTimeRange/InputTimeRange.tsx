import { useCallback, useMemo } from 'react'

import dayjs from 'dayjs'

import { CommonProps, SyntheticChangeEvent } from 'types/common'

import InputSelect, { SelectOptionType } from '../InputSelect'
import InputWrapper, { InputWrapperProps } from '../InputWrapper'

export type TimeRangeType = {
  start: Date
  end: Date
}

export const defaultTimeRange = {
  start: dayjs().startOf('day').toDate(),
  end: dayjs().endOf('day').subtract(29, 'minute').startOf('minute').toDate(),
}

type InputTimeRangeProps = CommonProps &
  InputWrapperProps & {
    name?: string
    value?: TimeRangeType
    onChange?: (e: SyntheticChangeEvent<TimeRangeType>) => void
    onValueChange?: (next: TimeRangeType) => void
  }
const InputTimeRange = ({
  id,
  className,
  label,
  error,
  helper,
  name,
  value = defaultTimeRange,
  onChange = () => undefined,
  onValueChange = () => undefined,
}: InputTimeRangeProps) => {
  const startOptions = useMemo<SelectOptionType<string>[]>(() => {
    const data: SelectOptionType<string>[] = []
    const start = dayjs().startOf('day')
    for (let i = 0; i < 48; i++) {
      const next = start.add(i * 30, 'minute')
      if (next.toDate() < value.end) {
        data.push({
          label: next.format('hh:mm A'),
          value: next.format('hh:mm A'),
        })
      }
    }
    return data
  }, [value])
  const endOptions = useMemo<SelectOptionType<string>[]>(() => {
    const data: SelectOptionType<string>[] = []
    const start = dayjs().startOf('day')
    for (let i = 0; i < 48; i++) {
      const next = start.add(i * 30, 'minute')
      if (next.toDate() > value.start) {
        data.push({
          label: next.format('hh:mm A'),
          value: next.format('hh:mm A'),
        })
      }
    }
    return data
  }, [value])

  const handleChange = useCallback(
    (next: string, mode: 'start' | 'end') => {
      const date = dayjs(next, 'hh:mm A').toDate()
      const nextValue = {
        ...value,
        [mode]: date,
      }
      onChange({
        target: {
          name,
          value: nextValue,
        },
      })
      onValueChange(nextValue)
    },
    [name, value, onChange, onValueChange],
  )

  return (
    <InputWrapper
      id={id}
      className={className}
      label={label}
      error={error}
      helper={helper}
    >
      <div className="flex flex-row items-center">
        <InputSelect
          options={startOptions}
          value={dayjs(value.start).format('hh:mm A')}
          onValueChange={(next) => handleChange(next as string, 'start')}
        />
        <p className="mx-2">to</p>
        <InputSelect
          options={endOptions}
          value={dayjs(value.end).format('hh:mm A')}
          onValueChange={(next) => handleChange(next as string, 'end')}
        />
      </div>
    </InputWrapper>
  )
}
export default InputTimeRange
