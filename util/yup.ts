import * as Yup from 'yup'

export const isValidUrl = (url: string | undefined) => {
  try {
    if (url) {
      new URL(url)
    } else {
      return false
    }
  } catch (e) {
    return false
  }
  return true
}

export const currencyRegex = /^(\d+)(.\d{1,2})?$/

export default Yup
