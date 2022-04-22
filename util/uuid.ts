import { nanoid } from 'nanoid'

const uuid = (prefix = '', length = 10): string => {
  const id = nanoid(length)
  return prefix ? `${prefix}-${id}` : id
}
export default uuid
