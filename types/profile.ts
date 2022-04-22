import { FileType } from './file'

export type AvailabilityDayType = {
  enabled: boolean
  start: string
  end: string
}
export type AvailabilityType = {
  0: AvailabilityDayType
  1: AvailabilityDayType
  2: AvailabilityDayType
  3: AvailabilityDayType
  4: AvailabilityDayType
  5: AvailabilityDayType
  6: AvailabilityDayType
}

export type NotificationType = {
  id: string
  message: string
  href: string
}

export type ClientType = {
  /** epoch */
  createdTime: number
  tags: string[]
  description: string
  notifications: Record<string, NotificationType>
}

export type CoachType = {
  /** epoch */
  createdTime: number
  /** epoch */
  decisionTime: number | null
  decision: 'approved' | 'rejected' | null
  searchIndex: string[]
  businessName: string
  description: string
  links: string[]
  tags: string[]
  numPreviousClients: number
  education: string[]
  certifications: string[]
  experience: string[]
  availability: AvailabilityType
  notifications: Record<string, NotificationType>
}

export type ProfileType = {
  id: string
  firstName: string
  lastName: string
  /** epoch */
  dateOfBirth: number
  city: string
  profileImage: FileType | null
  mode: 'client' | 'coach'
  timezone: string
  lastUpdatedTime: number
  client: ClientType | null
  coach: CoachType | null
  /** epoch times */
  unavailableTimes: number[]
}
