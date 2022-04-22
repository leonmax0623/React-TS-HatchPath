import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import { initIcons } from 'components/common/Icon'

export const init = (): void => {
  initIcons()
  dayjs.extend(customParseFormat)
  dayjs.extend(utc)
  dayjs.extend(timezone)
}
