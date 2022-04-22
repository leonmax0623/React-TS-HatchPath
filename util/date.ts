import dayjs from 'dayjs'

export const getStartOfDecade = (value: Date) => {
  const startOfYear = dayjs(value).startOf('year')
  const diff = startOfYear.get('year') % 10
  return startOfYear.subtract(diff, 'year')
}

export const getEndOfDecade = (value: Date) => {
  const startOfYear = dayjs(value).startOf('year')
  const diff = startOfYear.get('year') % 10
  return startOfYear.add(10 - diff, 'year')
}
