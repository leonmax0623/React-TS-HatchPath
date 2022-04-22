import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'

export type MainErrorType =
  | 'UNKNOWN'
  | 'UNAUTHENTICATED'
  | 'ALREADY_EXISTS'
  | undefined

export const mainApi = createApi({
  reducerPath: 'mainApi',
  baseQuery: fakeBaseQuery<MainErrorType>(),
  tagTypes: [
    'Profiles',
    'Programs',
    'Jobs',
    'Blogs',
    'Enrollments',
    'Waitlist',
  ],
  endpoints: () => ({}),
})
