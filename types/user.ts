export type UserType = {
  id: string
  email: string
  name: string
  isEmailVerified: boolean
}

export const defaultUser: UserType = {
  id: '',
  email: '',
  name: '',
  isEmailVerified: false,
}
