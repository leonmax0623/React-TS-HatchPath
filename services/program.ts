import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import dayjs from 'dayjs'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage'

import { Firestore, Storage } from 'util/fire'
import { getProgramIndex } from 'util/search'
import uuid from 'util/uuid'

import { ProgramType } from 'types/program'

import { JOB_COLLECTION } from './job'
import { mainApi } from './main'

export const PROGRAM_COLLECTION = 'programs'
export type ProgramErrorType = 'UNKNOWN' | 'UNAUTHENTICATED' | undefined

export const getProgramById = async (programId: string) => {
  const docRef = doc(Firestore, PROGRAM_COLLECTION, programId)
  const document = await getDoc(docRef)
  if (document.exists()) {
    const profile = document.data() as ProgramType
    return profile
  } else {
    return undefined
  }
}

export const getProgramsByOwner = async (ownerId: string) => {
  const collectionRef = collection(Firestore, PROGRAM_COLLECTION)
  const q = query(
    collectionRef,
    where('owner', '==', ownerId),
    orderBy('createdTime', 'desc'),
    limit(1000),
  )
  const docs = await getDocs(q)
  const programs: ProgramType[] = []
  docs.forEach((doc) => {
    if (doc.exists()) {
      const p = doc.data() as ProgramType
      programs.push(p)
    }
  })
  return programs
}

export const programsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getProgram: builder.query<ProgramType | undefined, string>({
      queryFn: async (programId) => {
        const program = await getProgramById(programId)
        return {
          data: program,
        }
      },
      providesTags: (result) =>
        result ? [{ type: 'Programs', id: result.id }] : [],
    }),
    getProgramsById: builder.query<ProgramType[], string[]>({
      queryFn: async (ids) => {
        const programs: ProgramType[] = []
        for (const id of ids) {
          const program = await getProgramById(id)
          if (program) {
            programs.push(program)
          }
        }
        return {
          data: programs,
        }
      },
      providesTags: (result) => {
        const tags: { type: 'Programs'; id: string }[] = [
          { type: 'Programs', id: 'LIST' },
        ]
        if (result) {
          result.forEach(({ id }) => {
            tags.push({
              type: 'Programs',
              id,
            })
          })
        }
        return tags
      },
    }),
    getProgramsByOwner: builder.query<ProgramType[], string>({
      queryFn: async (ownerId) => {
        const programs = await getProgramsByOwner(ownerId)
        return {
          data: programs,
        }
      },
      providesTags: (result) => {
        const tags: { type: 'Programs'; id: string }[] = [
          { type: 'Programs', id: 'LIST' },
        ]
        if (result) {
          result.forEach(({ id }) => {
            tags.push({
              type: 'Programs',
              id,
            })
          })
        }
        return tags
      },
    }),
    getRecentPrograms: builder.query<ProgramType[], void>({
      queryFn: async () => {
        const collectionRef = collection(Firestore, PROGRAM_COLLECTION)
        const q = query(collectionRef, orderBy('createdTime', 'desc'), limit(3))
        const docs = await getDocs(q)
        const programs: ProgramType[] = []
        docs.forEach((doc) => {
          if (doc.exists()) {
            const p = doc.data() as ProgramType
            programs.push(p)
          }
        })
        return {
          data: programs,
        }
      },
      providesTags: (result) => {
        const tags: { type: 'Programs'; id: string }[] = [
          { type: 'Programs', id: 'LIST' },
        ]
        if (result) {
          result.forEach(({ id }) => {
            tags.push({
              type: 'Programs',
              id,
            })
          })
        }
        return tags
      },
    }),
    getRecommendedPrograms: builder.query<ProgramType[], string[]>({
      queryFn: async (tags) => {
        const programsRef = collection(Firestore, PROGRAM_COLLECTION)

        const q = query(
          programsRef,
          where(
            'searchIndex',
            'array-contains-any',
            tags.slice(0, Math.min(tags.length, 10)),
          ),
          orderBy('createdTime', 'desc'),
          limit(3),
        )
        const docs = await getDocs(q)
        const programs: ProgramType[] = []
        docs.forEach((doc) => {
          const program = doc.data() as ProgramType
          programs.push(program)
        })

        return {
          data: programs,
        }
      },
      providesTags: (result) => {
        const tags: { type: 'Programs'; id: string }[] = [
          { type: 'Programs', id: 'LIST' },
        ]
        if (result) {
          result.forEach(({ id }) => {
            tags.push({
              type: 'Programs',
              id,
            })
          })
        }
        return tags
      },
    }),
    getIsProgramInvited: builder.query<
      { programId: string; isInvited: boolean },
      {
        programId?: string
        clientId?: string
      }
    >({
      queryFn: async ({ programId, clientId }) => {
        let found = false
        if (clientId && programId) {
          const collectionRef = collection(Firestore, JOB_COLLECTION)
          const q = query(
            collectionRef,
            where('owner', '==', clientId),
            where('isOpen', '==', true),
            where('invitedPrograms', 'array-contains', programId),
            limit(1),
          )
          const docs = await getDocs(q)
          found = !docs.empty
        }
        return {
          data: {
            programId: programId || '',
            isInvited: found,
          },
        }
      },
      providesTags: (result) =>
        result?.programId
          ? [
              {
                type: 'Programs',
                id: result.programId,
              },
            ]
          : [],
    }),
    searchPrograms: builder.query<ProgramType[], string>({
      queryFn: async (search) => {
        const programsRef = collection(Firestore, PROGRAM_COLLECTION)

        const searchArray = search.trim().toLocaleLowerCase().split(' ')
        const q = query(
          programsRef,
          where(
            'searchIndex',
            'array-contains-any',
            searchArray.slice(0, Math.min(searchArray.length, 10)),
          ),
          orderBy('createdTime', 'desc'),
          limit(100),
        )
        const docs = await getDocs(q)
        const programs: ProgramType[] = []
        docs.forEach((doc) => {
          const program = doc.data() as ProgramType
          programs.push(program)
        })

        return {
          data: programs,
        }
      },
      providesTags: (result) => {
        const tags: { type: 'Programs'; id: string }[] = [
          { type: 'Programs', id: 'LIST' },
        ]
        if (result) {
          result.forEach(({ id }) => {
            tags.push({
              type: 'Programs',
              id,
            })
          })
        }
        return tags
      },
    }),
    createProgram: builder.mutation<
      ProgramType,
      {
        owner: string
        title: string
        description: string
        tags: string[]
        pricePerSession: number
      }
    >({
      queryFn: async ({ owner, title, description, tags, pricePerSession }) => {
        const lowerTags: string[] = tags.map((tag) =>
          tag.trim().toLocaleLowerCase(),
        )
        const program: ProgramType = {
          id: uuid(),
          createdTime: dayjs().valueOf(),
          owner,
          activeClients: [],
          searchIndex: getProgramIndex(title.trim(), lowerTags),
          title: title.trim(),
          description: description.trim(),
          tags: lowerTags,
          banner: null,
          pricePerSession,
          sessions: [],
          isOpen: false,
        }

        const ref = doc(Firestore, PROGRAM_COLLECTION, program.id)
        await setDoc(ref, program)

        return {
          data: program,
        }
      },
      invalidatesTags: (result) => {
        const tags: { type: 'Programs'; id: string }[] = [
          { type: 'Programs', id: 'LIST' },
        ]
        if (result) {
          tags.push({ type: 'Programs', id: result.id })
        }
        return tags
      },
    }),
    updateProgram: builder.mutation<
      string,
      {
        current: ProgramType
        next: Partial<ProgramType>
      }
    >({
      queryFn: async ({ current, next }) => {
        const nextProgram: ProgramType = {
          ...current,
          ...next,
          id: current.id,
        }
        nextProgram.searchIndex = getProgramIndex(
          nextProgram.title,
          nextProgram.tags,
        )

        const currBanner = current.banner
        const nextBanner = next.banner
        if (
          nextBanner &&
          (!currBanner || nextBanner.id !== currBanner?.id) &&
          !!nextBanner.data
        ) {
          if (currBanner) {
            const currFilePath = `programs/${current.owner}/${current.id}/${currBanner.id}`
            const currRef = ref(Storage, currFilePath)
            await deleteObject(currRef)
          }

          const nextFilePath = `programs/${current.owner}/${current.id}/${nextBanner.id}`
          const nextRef = ref(Storage, nextFilePath)
          await uploadBytes(nextRef, nextBanner.data, {
            contentType: nextBanner.format,
          })
          const url = await getDownloadURL(nextRef)
          nextBanner.url = url
          nextBanner.data = null
          nextProgram.banner = nextBanner
        } else if (currBanner && !nextBanner) {
          const currFilePath = `programs/${current.owner}/${current.id}/${currBanner.id}`
          const currRef = ref(Storage, currFilePath)
          await deleteObject(currRef)
          nextProgram.banner = null
        }

        const docRef = doc(Firestore, PROGRAM_COLLECTION, current.id)
        await updateDoc(docRef, nextProgram)
        return {
          data: current.id,
        }
      },
      invalidatesTags: (result) => {
        const tags: { type: 'Programs'; id: string }[] = [
          { type: 'Programs', id: 'LIST' },
        ]
        if (result) {
          tags.push({ type: 'Programs', id: result })
        }
        return tags
      },
    }),
    removeProgram: builder.mutation<string, string>({
      queryFn: async (programId) => {
        const ref = doc(Firestore, PROGRAM_COLLECTION, programId)
        await deleteDoc(ref)

        return {
          data: programId,
        }
      },
      invalidatesTags: (result) => [
        { type: 'Programs', id: 'LIST' },
        { type: 'Programs', id: result },
      ],
    }),
  }),
})
