import { MessageType } from './message'

export type ApplicationType = {
  id: string
  /** coach id */
  coach: string
  /** epoch */
  createdTime: number
  /** program id */
  program: string
  coverLetter: string
  price: number
  messages: MessageType[]
  isMessagingDisabled: boolean
}

export type JobType = {
  id: string
  /** client profile id */
  owner: string
  /** epoch */
  createdTime: number
  accepted: {
    /** id from application list */
    application: string
    /** program id */
    program: string
    /** coach id */
    coach: string
    /** enrollment id */
    enrollment: string
    /** epoch */
    acceptedTime: number
  } | null
  applications: Record<string, ApplicationType>
  /** list of profile ids */
  appliedCoaches: string[]
  /** list of application ids */
  unreadClientMessage: string[]
  /** list of application ids */
  unreadCoachMessage: string[]
  /** program ids */
  invitedPrograms: string[]
  /** profile ids */
  invitedCoaches: string[]
  searchIndex: string[]
  title: string
  tags: string[]
  description: string
  budget: number
  isOpen: boolean
}
