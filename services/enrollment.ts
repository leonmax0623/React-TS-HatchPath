import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
  updateDoc,
} from 'firebase/firestore'

import { callFunction, Firestore } from 'util/fire'

import { ErrorType } from 'types/common'
import { EnrollmentType } from 'types/enrollment'
import { ProfileType } from 'types/profile'
import { ProgramType } from 'types/program'

import { mainApi } from './main'
import { getProfileById, PROFILE_COLLECTION } from './profiles'
import { getProgramById, PROGRAM_COLLECTION } from './program'

export const ENROLLMENT_COLLECTION = 'enrollments'

export const enrollmentsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getEnrollment: builder.query<
      | {
          enrollment: EnrollmentType
          program: ProgramType
          client: ProfileType
          coach: ProfileType
        }
      | undefined,
      string
    >({
      queryFn: async (enrollmentId) => {
        const docRef = doc(Firestore, ENROLLMENT_COLLECTION, enrollmentId)
        try {
          const document = await getDoc(docRef)
          if (document.exists()) {
            const enrollment = document.data() as EnrollmentType

            const program = await getProgramById(enrollment.program)
            const client = await getProfileById(enrollment.client)
            const coach = await getProfileById(enrollment.coach)

            if (program && client && coach) {
              return {
                data: {
                  enrollment,
                  program,
                  client,
                  coach,
                },
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
        } catch (err) {
          if ((err as ErrorType).code === 'permission-error') {
            return {
              data: undefined,
            }
          } else {
            throw err
          }
        }
      },
      providesTags: (result) =>
        result ? [{ type: 'Enrollments', id: result.enrollment.id }] : [],
    }),
    getEnrollmentsByUser: builder.query<
      | {
          enrollment: EnrollmentType
          program: ProgramType
          client: ProfileType
          coach: ProfileType
        }[],
      {
        id?: string
        active: boolean
        type: 'client' | 'coach'
      }
    >({
      queryFn: async ({ id, active, type }) => {
        const data: {
          enrollment: EnrollmentType
          program: ProgramType
          client: ProfileType
          coach: ProfileType
        }[] = []
        if (id) {
          const collectionRef = collection(Firestore, ENROLLMENT_COLLECTION)
          const enrollmentQueries = query(
            collectionRef,
            where(type === 'client' ? 'client' : 'coach', '==', id),
            where('isActive', '==', active),
            limit(1000),
          )
          const enrollmentDocs = await getDocs(enrollmentQueries)
          for (const enrollmentDoc of enrollmentDocs.docs) {
            if (enrollmentDoc.exists()) {
              const enrollment = enrollmentDoc.data() as EnrollmentType
              const programRef = await getDoc(
                doc(Firestore, PROGRAM_COLLECTION, enrollment.program),
              )
              const clientRef = await getDoc(
                doc(Firestore, PROFILE_COLLECTION, enrollment.client),
              )
              const coachRef = await getDoc(
                doc(Firestore, PROFILE_COLLECTION, enrollment.coach),
              )
              if (
                programRef.exists() &&
                clientRef.exists() &&
                coachRef.exists()
              ) {
                const program = programRef.data() as ProgramType
                const client = clientRef.data() as ProfileType
                const coach = coachRef.data() as ProfileType
                data.push({
                  enrollment,
                  program,
                  client,
                  coach,
                })
              }
            }
          }
        }
        return {
          data: data,
        }
      },
      providesTags: (result) => {
        const tags: { type: 'Enrollments'; id: string }[] = [
          { type: 'Enrollments', id: 'LIST' },
        ]
        if (result) {
          result.forEach((r) => {
            tags.push({
              type: 'Enrollments',
              id: r.enrollment.id,
            })
          })
        }
        return tags
      },
    }),
    sendEnrollmentMessage: builder.mutation<
      string,
      {
        enrollmentId: string
        content: string
        userId: string
      }
    >({
      queryFn: async ({ enrollmentId, content }) => {
        await callFunction('enrollment', 'send-message', {
          enrollmentId,
          content,
        })

        return {
          data: enrollmentId,
        }
      },
      invalidatesTags: (result) => {
        const tags: { type: 'Enrollments'; id: string }[] = [
          { type: 'Enrollments', id: 'LIST' },
        ]
        if (result) {
          tags.push({ type: 'Enrollments', id: result })
        }
        return tags
      },
    }),
    markEnrollmentMessageRead: builder.mutation<
      string,
      {
        type: 'client' | 'coach'
        enrollmentId: string
      }
    >({
      queryFn: async ({ type, enrollmentId }) => {
        const docRef = doc(Firestore, ENROLLMENT_COLLECTION, enrollmentId)
        await updateDoc(docRef, {
          [type === 'client' ? 'unreadClientMessage' : 'unreadCoachMessage']:
            false,
        })
        return {
          data: enrollmentId,
        }
      },
      invalidatesTags: (result) => {
        const tags: { type: 'Enrollments'; id: string }[] = [
          { type: 'Enrollments', id: 'LIST' },
        ]
        if (result) {
          tags.push({ type: 'Enrollments', id: result })
        }
        return tags
      },
    }),
    proposeTime: builder.mutation<
      string,
      {
        enrollmentId: string
        sessionId: string
        time: number
      }
    >({
      queryFn: async ({ enrollmentId, sessionId, time }) => {
        await callFunction('enrollment', 'propose-time', {
          enrollmentId,
          sessionId,
          time,
        })
        return {
          data: enrollmentId,
        }
      },
      invalidatesTags: (result) => {
        const tags: { type: 'Enrollments'; id: string }[] = [
          { type: 'Enrollments', id: 'LIST' },
        ]
        if (result) {
          tags.push({ type: 'Enrollments', id: result })
        }
        return tags
      },
    }),
    acceptTime: builder.mutation<
      string,
      {
        enrollmentId: string
        sessionId: string
      }
    >({
      queryFn: async ({ enrollmentId, sessionId }) => {
        await callFunction('enrollment', 'accept-time', {
          enrollmentId,
          sessionId,
        })
        return {
          data: enrollmentId,
        }
      },
      invalidatesTags: (result) => {
        const tags: { type: 'Enrollments'; id: string }[] = [
          { type: 'Enrollments', id: 'LIST' },
        ]
        if (result) {
          tags.push({ type: 'Enrollments', id: result })
        }
        return tags
      },
    }),
    cancelTime: builder.mutation<
      string,
      {
        enrollmentId: string
        sessionId: string
      }
    >({
      queryFn: async ({ enrollmentId, sessionId }) => {
        await callFunction('enrollment', 'cancel-time', {
          enrollmentId,
          sessionId,
        })
        return {
          data: enrollmentId,
        }
      },
      invalidatesTags: (result) => {
        const tags: { type: 'Enrollments'; id: string }[] = [
          { type: 'Enrollments', id: 'LIST' },
        ]
        if (result) {
          tags.push({ type: 'Enrollments', id: result })
        }
        return tags
      },
    }),
  }),
})
