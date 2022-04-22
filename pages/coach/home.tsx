import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'

import Button from 'components/common/Button'
import Loader from 'components/common/Loader'

import { useAppSelector } from 'util/store'

import BlogList from 'components/features/blog/List'
import EnrollmentList from 'components/features/enrollment/List'
import JobList from 'components/features/job/List'
import ProgramList from 'components/features/program/List'
import ProgramForm from 'components/forms/program/Program'
import withAuth from 'components/hoc/withAuth'
import PageLayout from 'components/layouts/Page'
import SectionLayout from 'components/layouts/Section'
import { blogsApi } from 'services/blog'
import { enrollmentsApi } from 'services/enrollment'
import { jobsApi } from 'services/job'
import { programsApi } from 'services/program'

const HomePage: NextPage = () => {
  const { profile } = useAppSelector((state) => state.profile)
  const router = useRouter()

  const [showCreateProgram, setShowCreateProgram] = useState<boolean>(false)

  const { data: invited } = jobsApi.useGetInvitedJobsQuery(profile?.id)
  const { data: jobs } = jobsApi.useGetRecommendedJobsQuery(
    profile?.coach?.tags || [],
  )
  const {
    data: programs,
    isLoading: programsLoading,
    isError: programsError,
  } = programsApi.useGetProgramsByOwnerQuery(profile?.id || '')
  const {
    data: blogs,
    isLoading: blogsLoading,
    isError: blogsError,
  } = blogsApi.useGetBlogsByAuthorQuery(profile?.id || '')
  const { data: enrollments } = enrollmentsApi.useGetEnrollmentsByUserQuery({
    id: profile?.id,
    active: true,
    type: 'coach',
  })

  return (
    <PageLayout
      title="Home"
      error={programsError || blogsError}
      contentClassName="flex flex-col gap-y-8"
    >
      <div className="flex flex-row justify-between items-center">
        <h1>Hello {profile?.firstName}</h1>
        <div className="flex flex-row gap-x-2 items-center">
          <Button variant="text" href="/blog/create">
            New blog
          </Button>
          <Button onClick={() => setShowCreateProgram(true)}>
            New program
          </Button>
        </div>
      </div>
      {enrollments && enrollments.length > 0 && (
        <SectionLayout titleClassName="font-normal" title="Active enrollments">
          <EnrollmentList enrollments={enrollments} />
        </SectionLayout>
      )}
      {invited && invited.length > 0 && (
        <SectionLayout titleClassName="font-normal" title="Invited jobs">
          <JobList jobs={invited} />
        </SectionLayout>
      )}
      {jobs && jobs.length > 0 && (
        <SectionLayout titleClassName="font-normal" title="Recommended jobs">
          <JobList jobs={jobs} />
        </SectionLayout>
      )}
      <section className="relative w-full">
        {blogsLoading && (
          <Loader
            type="full"
            className="absolute top-0 left-0 bg-white opacity-80"
          />
        )}
        <h2>Your blogs</h2>
        {blogs?.length ? (
          <BlogList blogs={blogs} />
        ) : (
          <p>You don&apos;t have any blogs yet, create one today!</p>
        )}
      </section>
      <section className="relative w-full">
        {programsLoading && (
          <Loader
            type="full"
            className="absolute top-0 left-0 bg-white opacity-80"
          />
        )}
        <h2>Your programs</h2>
        {programs?.length ? (
          <ProgramList programs={programs} />
        ) : (
          <p>You don&apos;t have any programs yet, create one today!</p>
        )}
      </section>
      <ProgramForm
        open={showCreateProgram}
        onClose={() => setShowCreateProgram(false)}
        onSubmit={(id) => {
          setShowCreateProgram(false)
          router.push(`/program/${id}/manage`)
        }}
      />
    </PageLayout>
  )
}
export default withAuth(HomePage, { profileType: 'coach' })
