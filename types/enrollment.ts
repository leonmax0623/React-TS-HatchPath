import { MessageType } from './message'
import { ProfileType } from './profile'
import { ProgramType, SessionType } from './program'

export type EnrollmentType = {
  id: string
  /** program id */
  program: string
  /** user id */
  coach: string
  /** user id */
  client: string
  /** epoch */
  createdTime: number
  /** epoch */
  endTime: number | null
  isActive: boolean
  messages: MessageType[]
  unreadClientMessage: boolean
  unreadCoachMessage: boolean
  pricePerSession: number
  sessions: (SessionType & {
    /** epoch time */
    time: number | null
    clientAgreed: boolean
    coachAgreed: boolean
  })[]
}

export type EnrollmentListType = {
  enrollment: EnrollmentType
  program: ProgramType
  coach: ProfileType
  client: ProfileType
}
