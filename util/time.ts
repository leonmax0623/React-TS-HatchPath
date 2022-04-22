import dayjs from 'dayjs'

import { AvailabilityType } from 'types/profile'

export const getDefaultAvailability = () => {
  const defaultTimeRange: { start: string; end: string } = {
    start: dayjs().startOf('day').set('hour', 9).format('hh:mm A'),
    end: dayjs().startOf('day').set('hour', 17).format('hh:mm A'),
  }
  const data: AvailabilityType = {
    0: {
      enabled: false,
      ...defaultTimeRange,
    },
    1: {
      enabled: true,
      ...defaultTimeRange,
    },
    2: {
      enabled: true,
      ...defaultTimeRange,
    },
    3: {
      enabled: true,
      ...defaultTimeRange,
    },
    4: {
      enabled: true,
      ...defaultTimeRange,
    },
    5: {
      enabled: true,
      ...defaultTimeRange,
    },
    6: {
      enabled: false,
      ...defaultTimeRange,
    },
  }
  return data
}
