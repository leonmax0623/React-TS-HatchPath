export type WaitlistType = {
  id: string
  name: string
  email: string
  city: string
  tags: []
  type: 'client' | 'coach'
  /** epoch */
  createdTime: number
}
