import { callFunction } from 'util/fire'

import { mainApi } from './main'

export const WAITLIST_COLLECTION = 'waitlist'
export type WaitlistErrorType =
  | 'UNKNOWN'
  | 'UNAUTHENTICATED'
  | 'ALREADY_EXISTS'
  | undefined

export const waitlistApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    addWaitlist: builder.mutation<
      void,
      {
        name: string
        email: string
        city: string
        tags: string[]
        type: 'client' | 'coach'
      }
    >({
      queryFn: async (waitlist) => {
        try {
          await callFunction('waitlist', 'add-waitlist', waitlist)
          return {
            data: undefined,
          }
        } catch (err) {
          return {
            error: 'ALREADY_EXISTS',
          }
        }
      },
    }),
  }),
})
