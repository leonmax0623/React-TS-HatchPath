import { useEffect, useMemo, useState } from 'react'

import dayjs, { Dayjs } from 'dayjs'

import cn from 'util/classnames'
import { getEndOfDecade, getStartOfDecade } from 'util/date'
import { range } from 'util/list'

import { CommonProps } from 'types/common'

import Button, { IconButton } from '../Button'

type DatePickerProps = CommonProps & {
  value?: Date
  onValueChange?: (value: Date) => void
  showShortcuts?: boolean
  minDate?: Date
  maxDate?: Date
  unavailableDates?: Date[]
}

const DatePicker = ({
  id,
  className,
  value,
  onValueChange = () => undefined,
  showShortcuts = true,
  minDate,
  maxDate,
  unavailableDates = [],
}: DatePickerProps): JSX.Element => {
  const [mode, setMode] = useState<'decade' | 'year' | 'month'>('month')
  const [focusDate, setFocusDate] = useState<Dayjs>(dayjs(value))

  const weekDays = useMemo<Dayjs[]>(
    () => range(0, 7).map((idx) => dayjs().day(idx)),
    [],
  )
  const dates = useMemo<Dayjs[]>(() => {
    const startOfMonth = dayjs(focusDate).startOf('month')
    const endOfMonth = dayjs(focusDate).endOf('month')

    const startOfWeek = startOfMonth.startOf('week')
    const numPrefix = startOfMonth.diff(startOfWeek, 'day')

    const endOfWeek = endOfMonth.endOf('week')
    const numSuffix = endOfWeek.diff(endOfMonth, 'day')
    const data: Dayjs[] = []
    range(0, numPrefix)
      .reverse()
      .forEach((idx) => data.push(startOfMonth.subtract(idx + 1, 'day')))
    range(0, startOfMonth.daysInMonth()).forEach((idx) =>
      data.push(startOfMonth.add(idx, 'day')),
    )
    range(0, numSuffix).forEach((idx) =>
      data.push(endOfMonth.add(idx + 1, 'day')),
    )
    return data
  }, [focusDate])
  const months = useMemo<Dayjs[]>(() => {
    const startOfYear = dayjs(focusDate).startOf('year')
    const data: Dayjs[] = []
    range(0, 12).forEach((idx) => data.push(startOfYear.add(idx, 'month')))
    return data
  }, [focusDate])
  const years = useMemo<Dayjs[]>(() => {
    const startOfDecade = getStartOfDecade(focusDate.toDate())
    const data: Dayjs[] = []
    range(0, 10).forEach((idx) => data.push(startOfDecade.add(idx, 'year')))
    return data
  }, [focusDate])
  const decadeString = useMemo<string>(() => {
    const start = getStartOfDecade(focusDate.toDate())
    const end = getEndOfDecade(focusDate.toDate())
    return `${start.format('YYYY')} - ${end.format('YYYY')}`
  }, [focusDate])
  const shortcuts = useMemo<{ label: string; date: Dayjs }[]>(
    () => [
      {
        label: 'Yesterday',
        date: dayjs().subtract(1, 'day'),
      },
      {
        label: 'Today',
        date: dayjs(),
      },
      {
        label: 'Tomorrow',
        date: dayjs().add(1, 'day'),
      },
    ],
    [],
  )

  useEffect(() => {
    if (value) {
      setFocusDate(dayjs(value))
    }
  }, [value])

  return (
    <div id={id} className={cn('py-2', className)}>
      <div className="flex flex-row items-center px-2 mb-2">
        <h1
          className="mr-auto text-md hover:underline"
          role="button"
          onClick={() =>
            setMode(
              mode === 'month' ? 'year' : mode === 'year' ? 'decade' : 'month',
            )
          }
        >
          {focusDate.format(
            mode === 'month'
              ? 'MMMM YYYY'
              : mode === 'year'
              ? 'YYYY'
              : decadeString,
          )}
        </h1>

        <IconButton
          variant="text"
          icon={{
            icon: 'angle-left',
          }}
          tooltip={{
            label:
              mode === 'month'
                ? 'Previous month'
                : mode === 'year'
                ? 'Previous year'
                : 'Previous decade',
          }}
          ariaLabel={
            mode === 'month'
              ? 'Previous month'
              : mode === 'year'
              ? 'Previous year'
              : 'Previous decade'
          }
          onClick={() =>
            setFocusDate(
              mode === 'decade'
                ? focusDate.subtract(10, 'year')
                : focusDate.subtract(1, mode === 'year' ? 'year' : 'month'),
            )
          }
        />
        <IconButton
          variant="text"
          icon={{
            icon: 'angle-right',
          }}
          tooltip={{
            label:
              mode === 'month'
                ? 'Next month'
                : mode === 'year'
                ? 'Next year'
                : 'Next decade',
          }}
          ariaLabel={
            mode === 'month'
              ? 'Next month'
              : mode === 'year'
              ? 'Next year'
              : 'Next decade'
          }
          onClick={() =>
            setFocusDate(
              mode === 'decade'
                ? focusDate.add(10, 'year')
                : focusDate.add(1, mode === 'year' ? 'year' : 'month'),
            )
          }
        />
      </div>
      {mode === 'month' ? (
        <>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, idx) => (
              <p key={idx} className="font-bold text-center text-teal-800">
                {day.format('dd')}
              </p>
            ))}
            {dates.map((date, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-center items-center"
              >
                <button
                  className={cn(
                    'py-1 px-2 disabled:text-gray-400 hover:underline disabled:hover:no-underline disabled:cursor-not-allowed',
                    {
                      'text-gray-400': !date.isSame(focusDate, 'month'),
                      'font-bold text-white bg-purple-700 rounded': date.isSame(
                        value,
                        'day',
                      ),
                    },
                  )}
                  onClick={() => onValueChange(date.startOf('day').toDate())}
                  type="button"
                  disabled={
                    (minDate && date.toDate() < minDate) ||
                    (maxDate && date.toDate() > maxDate) ||
                    unavailableDates.some((x) => dayjs(x).isSame(date, 'day'))
                  }
                >
                  {date.format('DD')}
                </button>
              </div>
            ))}
          </div>
          {showShortcuts && (
            <div className="flex flex-row justify-end items-center mt-4">
              {shortcuts.map(({ label, date }, idx) => (
                <Button
                  key={idx}
                  className={cn({ 'ml-1': idx > 0 })}
                  variant={date.isSame(value, 'day') ? 'default' : 'text'}
                  size="sm"
                  onClick={() => onValueChange(date.toDate())}
                >
                  {label}
                </Button>
              ))}
            </div>
          )}
        </>
      ) : mode === 'year' ? (
        <div className="grid grid-cols-12 gap-4">
          {months.map((date, idx) => (
            <div
              key={idx}
              className="flex flex-col col-span-4 justify-center items-center"
            >
              <button
                key={idx}
                className={cn('py-1 px-2 text-gray-800 hover:underline', {
                  'font-bold text-white bg-purple-700 rounded': date.isSame(
                    value,
                    'month',
                  ),
                })}
                onClick={() => {
                  setFocusDate(date)
                  setMode('month')
                }}
                type="button"
              >
                {date.format('MMM')}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-4">
          {years.map((date, idx) => (
            <div
              key={idx}
              className="flex flex-col col-span-4 justify-center items-center"
            >
              <button
                key={idx}
                className={cn('py-1 px-2 text-gray-800 hover:underline', {
                  'font-bold text-white bg-purple-700 rounded': date.isSame(
                    value,
                    'month',
                  ),
                })}
                onClick={() => {
                  setFocusDate(date)
                  setMode('year')
                }}
                type="button"
              >
                {date.format('YYYY')}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
export default DatePicker
