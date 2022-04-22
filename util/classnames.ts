import clsx from 'clsx'
import { overrideTailwindClasses } from 'tailwind-override'

const cn = (
  ...args: Array<
    | string
    | Array<string | Record<string, unknown> | unknown>
    | Record<string, unknown>
    | undefined
  >
): string => overrideTailwindClasses(clsx(...args), { jit: true })
export default cn
