export type CommonProps = {
  id?: string
  className?: string
}

export type SyntheticChangeEvent<T> = {
  target: {
    name?: string
    value: T
  }
}

export type SyntheticBlurEvent = {
  target: {
    name?: string
  }
}

export type ErrorType = {
  code?: string
}
