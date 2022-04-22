export type FileType = {
  id: string
  name: string
  format: string
  size: number
  url: string | null
  data: File | null
  extra: Record<string, unknown>
}
