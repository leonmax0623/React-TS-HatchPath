import { uniqueJoin } from './list'

export const getProfileIndex = (
  firstName: string,
  lastName: string,
  tags: string[],
  businessName = '',
): string[] => {
  return uniqueJoin(
    firstName.toLocaleLowerCase('en-US').trim().split(' '),
    lastName.toLocaleLowerCase('en-US').trim().split(' '),
    businessName.toLocaleLowerCase('en-US').trim().split(' '),
    tags
      .map((tag) =>
        tag
          .toLocaleLowerCase('en-US')
          .trim()
          .split(' ')
          .map((sub) => sub.replace(/[({})]/, '').trim()),
      )
      .flat(),
  )
}

export const getProgramIndex = (title: string, tags: string[]): string[] => {
  return uniqueJoin(
    title.toLocaleLowerCase().trim().split(' '),
    tags
      .map((tag) =>
        tag
          .toLocaleLowerCase()
          .trim()
          .split(' ')
          .map((sub) => sub.replace(/[({})]/, '').trim()),
      )
      .flat(),
  )
}

export const getBlogIndex = (title: string, tags: string[]): string[] => {
  return uniqueJoin(
    title.toLocaleLowerCase().trim().split(' '),
    tags
      .map((tag) =>
        tag
          .toLocaleLowerCase()
          .trim()
          .split(' ')
          .map((sub) => sub.replace(/[({})]/, '').trim()),
      )
      .flat(),
  )
}

export const getJobIndex = (title: string, tags: string[]): string[] => {
  return uniqueJoin(
    title.toLocaleLowerCase().trim().split(' '),
    tags
      .map((tag) =>
        tag
          .toLocaleLowerCase()
          .trim()
          .split(' ')
          .map((sub) => sub.replace(/[({})]/, '').trim()),
      )
      .flat(),
  )
}
