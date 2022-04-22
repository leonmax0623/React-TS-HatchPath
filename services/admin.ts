import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import dayjs from 'dayjs'
import FileSaver from 'file-saver'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import Papa from 'papaparse'

import { isDev, isRemote } from 'util/env'
import { callFunction, Firestore } from 'util/fire'

import { ProfileType } from 'types/profile'
import { WaitlistType } from 'types/waitlist'

export const PROFILE_COLLECTION = 'profiles'
export const WAITLIST_COLLECTION = 'waitlist'
export type AdminErrorType = 'UNKNOWN' | 'UNAUTHENTICATED' | undefined

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fakeBaseQuery<AdminErrorType>(),
  tagTypes: ['Profiles', 'Waitlist'],
  endpoints: (builder) => ({
    getCoach: builder.query<ProfileType | undefined, string>({
      queryFn: async (profileId) => {
        const profilesRef = doc(Firestore, PROFILE_COLLECTION, profileId)
        const response = await getDoc(profilesRef)
        if (response.exists()) {
          const coach = response.data() as ProfileType
          if (coach.coach) {
            return {
              data: coach,
            }
          } else {
            return {
              data: undefined,
            }
          }
        } else {
          return {
            data: undefined,
          }
        }
      },
      providesTags: (result) =>
        result ? [{ type: 'Profiles', id: result.id }] : [],
    }),
    approveCoach: builder.mutation<string, string>({
      queryFn: async (profileId) => {
        await callFunction('admin', 'review-coach', {
          id: profileId,
          decision: 'approved',
        })
        return {
          data: profileId,
        }
      },
      invalidatesTags: (result) => [
        { type: 'Profiles', result },
        { type: 'Profiles', id: 'LIST' },
      ],
    }),
    rejectCoach: builder.mutation<string, string>({
      queryFn: async (profileId) => {
        await callFunction('admin', 'review-coach', {
          id: profileId,
          decision: 'rejected',
        })
        return {
          data: profileId,
        }
      },
      invalidatesTags: (result) => [
        { type: 'Profiles', result },
        { type: 'Profiles', id: 'LIST' },
      ],
    }),
    getCoachesUnderReview: builder.query<ProfileType[], undefined>({
      queryFn: async () => {
        const profilesRef = collection(Firestore, PROFILE_COLLECTION)
        const profilesQuery = query(
          profilesRef,
          where('coach.decision', '==', null),
          orderBy('coach.createdTime', 'asc'),
          limit(100),
        )
        const response = await getDocs(profilesQuery)
        const profiles: ProfileType[] = []
        response.forEach((doc) => {
          if (doc.exists()) {
            const profile = doc.data() as ProfileType
            profiles.push(profile)
          }
        })
        return {
          data: profiles,
        }
      },
      providesTags: (result) => {
        const tags: { type: 'Profiles'; id: string }[] = [
          { type: 'Profiles', id: 'LIST' },
        ]
        if (result) {
          Object.values(result).forEach(({ id }) => {
            tags.push({
              type: 'Profiles',
              id,
            })
          })
        }
        return tags
      },
    }),
    getWaitlist: builder.query<WaitlistType[], void>({
      queryFn: async () => {
        const ref = collection(Firestore, WAITLIST_COLLECTION)
        const q = query(ref, orderBy('createdTime', 'desc'), limit(100))
        const docs = await getDocs(q)
        const waitlist: WaitlistType[] = []

        docs.forEach((doc) => {
          if (doc.exists()) {
            const w = doc.data() as WaitlistType
            waitlist.push(w)
          }
        })
        return {
          data: waitlist,
        }
      },
      providesTags: (result) => {
        const tags: { type: 'Waitlist'; id: string }[] = [
          { type: 'Waitlist', id: 'LIST' },
        ]
        if (result) {
          Object.values(result).forEach(({ id }) => {
            tags.push({
              type: 'Waitlist',
              id,
            })
          })
        }
        return tags
      },
    }),
    downloadWaitlist: builder.mutation<number, void>({
      queryFn: async () => {
        const ref = collection(Firestore, WAITLIST_COLLECTION)
        const q = query(ref, orderBy('createdTime', 'desc'), limit(100))
        const docs = await getDocs(q)
        const waitlist: Record<string, string>[] = []
        docs.forEach((doc) => {
          if (doc.exists()) {
            const w = doc.data() as WaitlistType
            waitlist.push({
              ...w,
              tags: w.tags.join(', '),
              createdTime: dayjs(w.createdTime).format('MMM DD, YYYY hh:mm: A'),
            })
          }
        })

        const csv = Papa.unparse(waitlist)
        FileSaver.saveAs(
          new File([csv], 'waitlist.csv', {
            type: 'text/csv;charset=utf-8;',
          }),
        )

        return {
          data: waitlist.length,
        }
      },
    }),
    addData: builder.mutation<void, void>({
      queryFn: async () => {
        if (isDev && !isRemote) {
          await callFunction('dev', 'create-data', {})
        }
        return {
          data: undefined,
        }
      },
      invalidatesTags: () => [
        { type: 'Profiles', id: 'LIST' },
        { type: 'Waitlist', id: 'LIST' },
      ],
    }),
    wipeData: builder.mutation<void, void>({
      queryFn: async () => {
        if (isDev && !isRemote) {
          await callFunction('dev', 'wipe-data', {})
        }
        return {
          data: undefined,
        }
      },
      invalidatesTags: () => [
        { type: 'Profiles', id: 'LIST' },
        { type: 'Waitlist', id: 'LIST' },
      ],
    }),
  }),
})
