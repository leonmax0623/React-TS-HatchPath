export type ButtonSizeType = 'xs' | 'sm' | 'md' | 'lg'
export type ButtonColorType =
  | 'primary'
  | 'secondary'
  | 'warning'
  | 'error'
  | 'success'
  | 'black'
  | 'inverse'
export type ButtonVariantType = 'default' | 'outlined' | 'text' | 'link'

export const getColorScheme = (color: ButtonColorType) => {
  switch (color) {
    case 'primary':
      return 'purple'
    case 'secondary':
      return 'gray'
    case 'warning':
      return 'yellow'
    case 'error':
      return 'red'
    case 'success':
      return 'green'
    case 'black':
      return 'black'
    case 'inverse':
      return 'whiteAlpha'
  }
}

export const getButtonVariant = (variant: ButtonVariantType) => {
  switch (variant) {
    case 'default':
      return 'solid'
    case 'outlined':
      return 'outline'
    case 'text':
      return 'ghost'
    case 'link':
      return 'link'
  }
}
