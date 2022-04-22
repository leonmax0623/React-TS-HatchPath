import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'

import Button from 'components/common/Button'

import { useAppSelector } from 'util/store'

import BlogList from 'components/features/blog/List'
import EnrollmentList from 'components/features/enrollment/List'
import JobListByOwner from 'components/features/job/ListByOwner'
import ProfileList from 'components/features/profile/List'
import ProgramList from 'components/features/program/List'
import JobForm from 'components/forms/Job'
import withAuth from 'components/hoc/withAuth'
import PageLayout from 'components/layouts/Page'
import SectionLayout from 'components/layouts/Section'
import { blogsApi } from 'services/blog'
import { enrollmentsApi } from 'services/enrollment'
import { profilesApi } from 'services/profiles'
import { programsApi } from 'services/program'

const HomePage: NextPage = () => {
  const router = useRouter()
  const { profile } = useAppSelector((state) => state.profile)

  const [open, setOpen] = useState<boolean>(false)

  const { data: programs } = programsApi.useGetRecommendedProgramsQuery(
    profile?.client?.tags || [],
  )
  const { data: coaches } = profilesApi.useGetRecommendedCoachesQuery(
    profile?.client?.tags || [],
  )
  const { data: blogs } = blogsApi.useGetRecommendedBlogsQuery(
    profile?.client?.tags || [],
  )
  const { data: enrollments } = enrollmentsApi.useGetEnrollmentsByUserQuery({
    id: profile?.id,
    active: true,
    type: 'client',
  })

  return (
    <PageLayout title="Home">
      <div className="flex flex-row justify-between items-center">
        <h1>Hello {profile?.firstName}</h1>
        <Button onClick={() => setOpen(true)}>New job</Button>
      </div>
      <div className="flex flex-col gap-y-10 mt-10">
        {enrollments && enrollments.length > 0 && (
          <SectionLayout
            titleClassName="font-normal"
            title="Active enrollments"
          >
            <EnrollmentList enrollments={enrollments} />
          </SectionLayout>
        )}
        <SectionLayout titleClassName="font-normal" title="Your jobs">
          <JobListByOwner
            mode="open"
            emptyMessage="No open jobs, create one now!"
          />
        </SectionLayout>
        {blogs && blogs.length > 0 && (
          <SectionLayout
            titleClassName="font-normal"
            title="Interesting readings"
          >
            <BlogList blogs={blogs} />
          </SectionLayout>
        )}
        {programs && programs.length > 0 && (
          <SectionLayout titleClassName="font-normal" title="Programs for you">
            <ProgramList programs={programs} />
          </SectionLayout>
        )}
        {coaches && coaches.length > 0 && (
          <SectionLayout
            titleClassName="font-normal"
            title="Recommended coaches"
          >
            <ProfileList profiles={coaches} />
          </SectionLayout>
        )}
      </div>
      <JobForm
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(next) => router.push(`/job/${next}`)}
      />
    </PageLayout>
  )
}
export default withAuth(HomePage, { profileType: 'client' })
