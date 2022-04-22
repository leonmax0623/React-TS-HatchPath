import dayjs from 'dayjs'
import {
  arrayRemove,
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

import { callFunction, Firestore } from 'util/fire'
import { getJobIndex } from 'util/search'
import uuid from 'util/uuid'

import { JobType } from 'types/job'

import { mainApi } from './main'

export const JOB_COLLECTION = 'jobs'
export const getJobById = async (jobId: string) => {
  const docRef = doc(Firestore, JOB_COLLECTION, jobId)
  const document = await getDoc(docRef)
  if (document.exists()) {
    const blog = document.data() as JobType
    return blog
  } else {
    return undefined
  }
}

export const getJobsByInvitedCoach = async (coachId: string) => {
  const collectionRef = collection(Firestore, JOB_COLLECTION)
  const q = query(
    collectionRef,
    where('invitedCoaches', 'array-contains', coachId),
    limit(1000),
  )
  const docs = await getDocs(q)

  const jobs: JobType[] = []
  docs.forEach((doc) => jobs.push(doc.data() as JobType))
  return jobs
}

export const jobsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getJob: builder.query<JobType | undefined, string>({
      queryFn: async (jobId) => {
        const job = await getJobById(jobId)
        return {
          data: job,
        }
      },
      providesTags: (result) =>
        result ? [{ type: 'Jobs', id: result.id }] : [],
    }),
    getJobsByOwner: builder.query<
      JobType[],
      {
        clientId?: string
        isOpen: boolean
      }
    >({
      queryFn: async ({ clientId, isOpen }) => {
        const jobs: JobType[] = []

        if (clientId) {
          const collectionRef = collection(Firestore, JOB_COLLECTION)
          const q = query(
            collectionRef,
            where('owner', '==', clientId),
            where('isOpen', '==', isOpen),
            orderBy('createdTime', 'desc'),
            limit(1000),
          )
          const docs = await getDocs(q)
          docs.forEach((doc) => jobs.push(doc.data() as JobType))
        }

        return {
          data: jobs,
        }
      },
      providesTags: (result) => {
        const tags: { type: 'Jobs'; id: string }[] = [
          { type: 'Jobs', id: 'LIST' },
        ]
        if (result) {
          result.forEach(({ id }) => {
            tags.push({
              type: 'Jobs',
              id,
            })
          })
        }
        return tags
      },
    }),
    getJobsByCoach: builder.query<
      JobType[],
      { coachId?: string; isOpen: boolean }
    >({
      queryFn: async ({ coachId, isOpen }) => {
        const jobs: JobType[] = []

        if (coachId) {
          const collectionRef = collection(Firestore, JOB_COLLECTION)
          const q = query(
            collectionRef,
            where('appliedCoaches', 'array-contains', coachId),
            where('isOpen', '==', isOpen),
            orderBy('createdTime', 'desc'),
            limit(1000),
          )
          const docs = await getDocs(q)
          docs.forEach((doc) => jobs.push(doc.data() as JobType))
        }

        return {
          data: jobs,
        }
      },
      providesTags: (result) => {
        const tags: { type: 'Jobs'; id: string }[] = [
          { type: 'Jobs', id: 'LIST' },
        ]
        if (result) {
          result.forEach(({ id }) => {
            tags.push({
              type: 'Jobs',
              id,
            })
          })
        }
        return tags
      },
    }),
    getJobsByInvitedCoach: builder.query<JobType[], string>({
      queryFn: async (coachId) => {
        const jobs = await getJobsByInvitedCoach(coachId)
        return {
          data: jobs,
        }
      },
      providesTags: (result) => {
        const tags: { type: 'Jobs'; id: string }[] = [
          { type: 'Jobs', id: 'LIST' },
        ]
        if (result) {
          result.forEach(({ id }) => {
            tags.push({
              type: 'Jobs',
              id,
            })
          })
        }
        return tags
      },
    }),
    getRecentJobs: builder.query<JobType[], void>({
      queryFn: async () => {
        const collectionRef = collection(Firestore, JOB_COLLECTION)
        const q = query(
          collectionRef,
          where('isOpen', '==', true),
          orderBy('createdTime', 'desc'),
          limit(3),
        )
        const docs = await getDocs(q)
        const jobs: JobType[] = []
        docs.forEach((doc) => {
          if (doc.exists()) {
            const b = doc.data() as JobType
            jobs.push(b)
          }
        })
        return {
          data: jobs,
        }
      },
      providesTags: (result) => {
        const tags: { type: 'Jobs'; id: string }[] = [
          { type: 'Jobs', id: 'LIST' },
        ]
        if (result) {
          result.forEach(({ id }) => {
            tags.push({
              type: 'Jobs',
              id,
            })
          })
        }
        return tags
      },
    }),
    getRecommendedJobs: builder.query<JobType[], string[]>({
      queryFn: async (tags) => {
        const jobsRef = collection(Firestore, JOB_COLLECTION)

        const q = query(
          jobsRef,
          where('isOpen', '==', true),
          where(
            'searchIndex',
            'array-contains-any',
            tags.slice(0, Math.min(tags.length, 10)),
          ),
          orderBy('createdTime', 'desc'),
          limit(3),
        )
        const docs = await getDocs(q)
        const jobs: JobType[] = []
        docs.forEach((doc) => {
          const blog = doc.data() as JobType
          jobs.push(blog)
        })

        return {
          data: jobs,
        }
      },
      providesTags: (result) => {
        const tags: { type: 'Jobs'; id: string }[] = [
          { type: 'Jobs', id: 'LIST' },
        ]
        if (result) {
          result.forEach(({ id }) => {
            tags.push({
              type: 'Jobs',
              id,
            })
          })
        }
        return tags
      },
    }),
    getInvitedJobs: builder.query<JobType[], string | undefined>({
      queryFn: async (coachId) => {
        const jobs: JobType[] = []
        if (coachId) {
          const jobsRef = collection(Firestore, JOB_COLLECTION)
          const q = query(
            jobsRef,
            where('isOpen', '==', true),
            where('invitedCoaches', 'array-contains', coachId),
            orderBy('createdTime', 'desc'),
            limit(1000),
          )
          const docs = await getDocs(q)
          docs.forEach((doc) => {
            const blog = doc.data() as JobType
            jobs.push(blog)
          })
        }
        return {
          data: jobs,
        }
      },
      providesTags: (result) => {
        const tags: { type: 'Jobs'; id: string }[] = [
          { type: 'Jobs', id: 'LIST' },
        ]
        if (result) {
          result.forEach(({ id }) => {
            tags.push({
              type: 'Jobs',
              id,
            })
          })
        }
        return tags
      },
    }),
    searchJobs: builder.query<JobType[], string>({
      queryFn: async (search) => {
        const jobsRef = collection(Firestore, JOB_COLLECTION)

        const searchArray = search.trim().toLocaleLowerCase().split(' ')
        const q = query(
          jobsRef,
          where('isOpen', '==', true),
          where(
            'searchIndex',
            'array-contains-any',
            searchArray.slice(0, Math.min(searchArray.length, 10)),
          ),
          orderBy('createdTime', 'desc'),
          limit(100),
        )
        const docs = await getDocs(q)
        const jobs: JobType[] = []
        docs.forEach((doc) => {
          const program = doc.data() as JobType
          jobs.push(program)
        })

        return {
          data: jobs,
        }
      },
      providesTags: (result) => {
        const tags: { type: 'Jobs'; id: string }[] = [
          { type: 'Jobs', id: 'LIST' },
        ]
        if (result) {
          result.forEach(({ id }) => {
            tags.push({
              type: 'Jobs',
              id,
            })
          })
        }
        return tags
      },
    }),
    createJob: builder.mutation<
      JobType,
      {
        owner: string
        title: string
        tags: string[]
        description: string
        budget: number
        isOpen: boolean
      }
    >({
      queryFn: async ({ owner, title, tags, description, budget, isOpen }) => {
        const lowerTags: string[] = tags.map((tag) =>
          tag.trim().toLocaleLowerCase(),
        )

        const job: JobType = {
          id: uuid(),
          createdTime: dayjs().valueOf(),
          accepted: null,
          applications: {},
          appliedCoaches: [],
          unreadClientMessage: [],
          unreadCoachMessage: [],
          invitedCoaches: [],
          invitedPrograms: [],
          owner,
          searchIndex: getJobIndex(title, lowerTags),
          title,
          description,
          tags: lowerTags,
          isOpen,
          budget,
        }

        const docRef = doc(Firestore, JOB_COLLECTION, job.id)
        await setDoc(docRef, job)

        return {
          data: job,
        }
      },
      invalidatesTags: (result) => {
        const tags: { type: 'Jobs'; id: string }[] = [
          { type: 'Jobs', id: 'LIST' },
        ]
        if (result) {
          tags.push({ type: 'Jobs', id: result.id })
        }
        return tags
      },
    }),
    updateJob: builder.mutation<
      string,
      {
        current: JobType
        next: Partial<JobType>
      }
    >({
      queryFn: async ({ current, next }) => {
        const nextJob: JobType = {
          ...current,
          ...next,
          id: current.id,
        }
        nextJob.searchIndex = getJobIndex(nextJob.title, nextJob.tags)

        const docRef = doc(Firestore, JOB_COLLECTION, current.id)
        await updateDoc(docRef, nextJob)
        return {
          data: current.id,
        }
      },
      invalidatesTags: (result) => {
        const tags: { type: 'Jobs'; id: string }[] = [
          { type: 'Jobs', id: 'LIST' },
        ]
        if (result) {
          tags.push({ type: 'Jobs', id: result })
        }
        return tags
      },
    }),
    markApplicationMessageRead: builder.mutation<
      string,
      {
        type: 'client' | 'coach'
        jobId: string
        applicationId: string
      }
    >({
      queryFn: async ({ type, jobId, applicationId }) => {
        const docRef = doc(Firestore, JOB_COLLECTION, jobId)
        await updateDoc(docRef, {
          [type === 'client' ? 'unreadClientMessage' : 'unreadCoachMessage']:
            arrayRemove(applicationId),
        })
        return {
          data: jobId,
        }
      },
      invalidatesTags: (result) => {
        const tags: { type: 'Jobs'; id: string }[] = [
          { type: 'Jobs', id: 'LIST' },
        ]
        if (result) {
          tags.push({ type: 'Jobs', id: result })
        }
        return tags
      },
    }),
    removeJob: builder.mutation<string, string>({
      queryFn: async (jobId) => {
        const ref = doc(Firestore, JOB_COLLECTION, jobId)
        await deleteDoc(ref)

        return {
          data: jobId,
        }
      },
      invalidatesTags: (result) => [
        { type: 'Jobs', id: 'LIST' },
        { type: 'Jobs', id: result },
      ],
    }),
    invite: builder.mutation<
      { jobId: string; coachId: string; programId?: string },
      {
        jobId: string
        coachId: string
        programId?: string
      }
    >({
      queryFn: async ({ jobId, programId, coachId }) => {
        await callFunction('job', 'send-invite', {
          jobId,
          programId,
          coachId,
        })
        return {
          data: { jobId, coachId, programId },
        }
      },
      invalidatesTags: (result) => {
        const tags: { type: 'Jobs' | 'Programs' | 'Profiles'; id: string }[] = [
          { type: 'Jobs', id: 'LIST' },
        ]
        if (result) {
          tags.push({ type: 'Jobs', id: result?.jobId })
          tags.push({ type: 'Profiles', id: result?.coachId })
          if (result.programId) {
            tags.push({ type: 'Programs', id: result.programId })
          }
        }
        return tags
      },
    }),
    createApplication: builder.mutation<
      { applicationId: string; jobId: string },
      {
        jobId: string
        programId: string
        coverLetter: string
        price: number
      }
    >({
      queryFn: async ({ jobId, programId, coverLetter, price }) => {
        const response = await callFunction('job', 'apply', {
          jobId,
          programId,
          coverLetter,
          price,
        })
        const applicationId = response.applicationId as string
        return {
          data: {
            jobId,
            applicationId,
          },
        }
      },
      invalidatesTags: (result) => {
        const tags: { type: 'Jobs'; id: string }[] = [
          { type: 'Jobs', id: 'LIST' },
        ]
        if (result) {
          tags.push({ type: 'Jobs', id: result.jobId })
        }
        return tags
      },
    }),
    sendApplicationMessage: builder.mutation<
      string,
      {
        jobId: string
        applicationId: string
        content: string
      }
    >({
      queryFn: async ({ jobId, applicationId, content }) => {
        await callFunction('job', 'send-message', {
          jobId,
          applicationId,
          content,
        })
        return {
          data: jobId,
        }
      },
      invalidatesTags: (result) => {
        const tags: { type: 'Jobs'; id: string }[] = [
          { type: 'Jobs', id: 'LIST' },
        ]
        if (result) {
          tags.push({ type: 'Jobs', id: result })
        }
        return tags
      },
    }),
    updateMessagingDisabled: builder.mutation<
      string,
      {
        jobId: string
        applicationId: string
        isDisabled: boolean
      }
    >({
      queryFn: async ({ jobId, applicationId, isDisabled }) => {
        const docRef = doc(Firestore, JOB_COLLECTION, jobId)
        await updateDoc(docRef, {
          [`applications.${applicationId}.isMessagingDisabled`]: isDisabled,
        })
        return {
          data: jobId,
        }
      },
      invalidatesTags: (result) => {
        const tags: { type: 'Jobs'; id: string }[] = [
          { type: 'Jobs', id: 'LIST' },
        ]
        if (result) {
          tags.push({ type: 'Jobs', id: result })
        }
        return tags
      },
    }),
    acceptApplication: builder.mutation<
      {
        jobId: string
        enrollmentId: string
      },
      {
        jobId: string
        applicationId: string
      }
    >({
      queryFn: async ({ jobId, applicationId }) => {
        const response = await callFunction('job', 'accept', {
          jobId,
          applicationId,
        })
        const enrollmentId = response.enrollmentId as string
        return {
          data: {
            jobId: jobId,
            enrollmentId: enrollmentId,
          },
        }
      },
      invalidatesTags: (result) => {
        const tags: { type: 'Jobs'; id: string }[] = [
          { type: 'Jobs', id: 'LIST' },
        ]
        if (result) {
          tags.push({ type: 'Jobs', id: result.jobId })
        }
        return tags
      },
    }),
  }),
})
