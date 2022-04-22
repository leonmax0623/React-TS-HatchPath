import { FileType } from './file'

export type BlogType = {
  id: string
  author: string
  /** epoch */
  createdTime: number
  searchIndex: string[]
  banner: FileType | null
  title: string
  tags: string[]
  content: string
  isPublished: boolean
}
