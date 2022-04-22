/* eslint-disable no-console */
import { isDev } from './env'

const log = {
  info: (...args: unknown[]): void =>
    isDev ? console.log(...args) : undefined,
  warn: (...args: unknown[]): void =>
    isDev ? console.warn(...args) : undefined,
  error: (...args: unknown[]): void =>
    isDev ? console.error(...args) : undefined,
}
export default log
