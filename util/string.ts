export const equalsIgnoreCase = (a?: string, b?: string, contains = false) => {
  if (a && b) {
    return contains
      ? a.toLocaleLowerCase().includes(b.toLocaleLowerCase())
      : a.toLocaleLowerCase() === b.toLocaleLowerCase()
  } else {
    return false
  }
}

export const usdFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})
export const cadFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'CAD',
})
