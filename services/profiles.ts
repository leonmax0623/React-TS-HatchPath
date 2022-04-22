import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
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

import { Firestore } from 'util/fire'

import { ProfileType } from 'types/profile'

import { JOB_COLLECTION } from './job'
import { mainApi } from './main'

export const PROFILE_COLLECTION = 'profiles'
export type ProfileErrorType = 'UNKNOWN' | 'UNAUTHENTICATED' | undefined

export const getProfileById = async (profileId: string) => {
  const docRef = doc(Firestore, PROFILE_COLLECTION, profileId)
  const document = await getDoc(docRef)
  if (document.exists()) {
    const profile = document.data() as ProfileType
    return profile
  } else {
    return undefined
  }
}

export const profilesApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ProfileType | undefined, string>({
      queryFn: async (profileId) => {
        const profile = await getProfileById(profileId)
        return {
          data: profile,
        }
      },
      providesTags: (result) =>
        result ? [{ type: 'Profiles', id: result.id }] : [],
    }),
    getProfilesById: builder.query<ProfileType[], string[]>({
      queryFn: async (ids) => {
        const profiles: ProfileType[] = []
        for (const id of ids) {
          const profile = await getProfileById(id)
          if (profile) {
            profiles.push(profile)
          }
        }
        return {
          data: profiles,
        }
      },
      providesTags: (result) => {
        const tags: { type: 'Profiles'; id: string }[] = [
          { type: 'Profiles', id: 'LIST' },
        ]
        if (result) {
          result.forEach(({ id }) => {
            tags.push({
              type: 'Profiles',
              id,
            })
          })
        }
        return tags
      },
    }),
    getRecentCoaches: builder.query<ProfileType[], void>({
      queryFn: async () => {
        const collectionRef = collection(Firestore, PROFILE_COLLECTION)
        const q = query(
          collectionRef,
          where('coach.createdTime', '!=', null),
          orderBy('coach.createdTime', 'desc'),
          limit(3),
        )
        const docs = await getDocs(q)
        const profiles: ProfileType[] = []
        docs.forEach((doc) => {
          if (doc.exists()) {
            const p = doc.data() as ProfileType
            profiles.push(p)
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
          result.forEach(({ id }) => {
            tags.push({
              type: 'Profiles',
              id,
            })
          })
        }
        return tags
      },
    }),
    getRecommendedCoaches: builder.query<ProfileType[], string[]>({
      queryFn: async (tags) => {
        const profilesRef = collection(Firestore, PROFILE_COLLECTION)

        const q = query(
          profilesRef,
          where(
            'coach.searchIndex',
            'array-contains-any',
            tags.slice(0, Math.min(tags.length, 10)),
          ),
          orderBy('coach.createdTime', 'desc'),
          limit(3),
        )
        const docs = await getDocs(q)
        const programs: ProfileType[] = []
        docs.forEach((doc) => {
          const program = doc.data() as ProfileType
          programs.push(program)
        })

        return {
          data: programs,
        }
      },
      providesTags: (result) => {
        const tags: { type: 'Profiles'; id: string }[] = [
          { type: 'Profiles', id: 'LIST' },
        ]
        if (result) {
          result.forEach(({ id }) => {
            tags.push({
              type: 'Profiles',
              id,
            })
          })
        }
        return tags
      },
    }),
    getIsCoachInvited: builder.query<
      { profileId: string; isInvited: boolean },
      {
        coachId?: string
        clientId?: string
      }
    >({
      queryFn: async ({ coachId, clientId }) => {
        let found = false
        if (clientId && coachId) {
          const collectionRef = collection(Firestore, JOB_COLLECTION)
          const q = query(
            collectionRef,
            where('owner', '==', clientId),
            where('isOpen', '==', true),
            where('invitedCoaches', 'array-contains', coachId),
            limit(1),
          )
          const docs = await getDocs(q)
          found = !docs.empty
        }
        return {
          data: {
            profileId: coachId || '',
            isInvited: found,
          },
        }
      },
      providesTags: (result) =>
        result?.profileId
          ? [
              {
                type: 'Profiles',
                id: result.profileId,
              },
            ]
          : [],
    }),
    searchCoaches: builder.query<ProfileType[], string>({
      queryFn: async (search) => {
        const profilesRef = collection(Firestore, PROFILE_COLLECTION)

        const searchArray = search.trim().toLocaleLowerCase().split(' ')
        const q = query(
          profilesRef,
          where(
            'coach.searchIndex',
            'array-contains-any',
            searchArray.slice(0, Math.min(searchArray.length, 10)),
          ),
          orderBy('coach.createdTime', 'desc'),
          limit(100),
        )
        const docs = await getDocs(q)
        const programs: ProfileType[] = []
        docs.forEach((doc) => {
          const program = doc.data() as ProfileType
          programs.push(program)
        })

        return {
          data: programs,
        }
      },
      providesTags: (result) => {
        const tags: { type: 'Profiles'; id: string }[] = [
          { type: 'Profiles', id: 'LIST' },
        ]
        if (result) {
          result.forEach(({ id }) => {
            tags.push({
              type: 'Profiles',
              id,
            })
          })
        }
        return tags
      },
    }),
    /** trick to connect the profile slice to api cache */
    invalidateProfile: builder.mutation<string, string>({
      queryFn: async (profileId) => {
        return {
          data: profileId,
        }
      },
      invalidatesTags: (result) => {
        const tags: { type: 'Profiles'; id: string }[] = [
          { type: 'Profiles', id: 'LIST' },
        ]
        if (result) {
          tags.push({ type: 'Profiles', id: result })
        }
        return tags
      },
    }),
  }),
})
