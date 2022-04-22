import { FileType } from './file'

export type SessionType = {
  id: string
  title: string
  description: string
}
export type ProgramType = {
  id: string
  /** epoch */
  createdTime: number
  /** userId of coach who owns this */
  owner: string
  /** userId of active clients */
  activeClients: string[]
  searchIndex: string[]
  title: string
  description: string
  tags: string[]
  banner: FileType | null
  pricePerSession: number
  sessions: SessionType[]
  isOpen: boolean
}
