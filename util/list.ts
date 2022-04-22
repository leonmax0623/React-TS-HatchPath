export const range = (lower: number, upper: number): number[] => {
  const data = []
  for (let i = lower; i < upper; i++) {
    data.push(i)
  }
  return data
}

export const removeIndex = <T>(array: T[], index: number): T[] => {
  const next = [...array]
  next.splice(index, 1)
  return next
}

export const uniqueAdd = <T>(array: T[], add: T): T[] => {
  const next = [...array]
  if (!array.some((item) => item === add)) {
    next.push(add)
  }
  return next
}

export const uniqueJoin = <T>(...args: T[][]): T[] => {
  return Array.from(new Set(args.flat()))
}

export const moveIndex = <T>(
  array: T[],
  oldIndex: number,
  newIndex: number,
): T[] => {
  const next = [...array]
  const startIndex = oldIndex < 0 ? next.length + oldIndex : oldIndex

  if (startIndex >= 0 && startIndex < next.length) {
    const endIndex = newIndex < 0 ? next.length + newIndex : newIndex

    const [item] = next.splice(oldIndex, 1)
    next.splice(endIndex, 0, item)
  }
  return next
}

export const listEquals = <T>(a: T[], b: T[], ignoreOrder = false): boolean => {
  return (
    a.length === b.length &&
    a.every((v, idx) => (ignoreOrder ? b.includes(v) : v === b[idx]))
  )
}

export const keyBy = <T extends Record<string, unknown>>(
  obj: T[],
  key: keyof T,
): Record<string, T> => {
  const data: Record<string, T> = {}
  obj.forEach((o) => {
    data[o[key] as string] = o
  })
  return data
}
