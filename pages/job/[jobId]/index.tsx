import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'

import dayjs from 'dayjs'

import Button from 'components/common/Button'

import { useAppSelector } from 'util/store'
import { usdFormat } from 'util/string'

import { ApplicationType, JobType } from 'types/job'
import { ProfileType } from 'types/profile'

import ProfileOverview from 'components/features/profile/Overview'
import ApplyForm from 'components/forms/Apply'
import withAuth from 'components/hoc/withAuth'
import PageLayout from 'components/layouts/Page'
import SectionLayout from 'components/layouts/Section'
import { getJobById } from 'services/job'
import { getProfileById } from 'services/profiles'

type JobPageProps = {
  job: JobType | null
  owner: ProfileType | null
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const data: JobPageProps = {
    job: null,
    owner: null,
  }
  if (context.query.jobId) {
    const job = await getJobById(context.query.jobId as string)
    if (job) {
      data.job = job
      const owner = await getProfileById(job.owner)
      data.owner = owner || null
    }
  }

  return {
    props: data,
  }
}
const JobPage: NextPage<JobPageProps> = ({ job, owner }) => {
  const { profile } = useAppSelector((state) => state.profile)
  const router = useRouter()

  const application = useMemo<ApplicationType | undefined>(
    () =>
      profile
        ? Object.values(job?.applications || {}).find(
            ({ coach }) => coach === profile?.id,
          )
        : undefined,
    [profile, job],
  )
  const userRelationship = useMemo<
    'owner' | 'applied' | 'coach' | 'not-authenticated' | 'not-coach'
  >(() => {
    if (profile) {
      if (profile.id === owner?.id) {
        return 'owner'
      } else if (application) {
        return 'applied'
      } else if (profile.coach) {
        return 'coach'
      } else {
        return 'not-coach'
      }
    } else {
      return 'not-authenticated'
    }
  }, [profile, owner, application])

  const [showApply, setShowApply] = useState<boolean>(false)

  return (
    <PageLayout
      title={job?.title}
      notFound={!job}
      contentClassName="flex flex-col gap-y-4"
    >
      <div className="flex flex-row justify-between items-center">
        <div>
          <h1>{job?.title}</h1>
          <div className="flex flex-row items-center">
            <p className="font-light">
              Created: {dayjs(job?.createdTime).format('MMM DD, YYYY')}
            </p>
            {job?.budget && (
              <p className="pl-2 ml-2 font-light border-l border-gray-300">
                Budget: {usdFormat.format(job.budget)}
              </p>
            )}
            <div className="pl-2 ml-2 border-l border-gray-300">
              <Button
                variant="link"
                href={`/profile/${owner?.id}`}
                color="secondary"
              >
                {owner?.firstName} {owner?.lastName}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-x-2 items-center">
          {!job?.isOpen ? (
            <p>This job is not open for applications at this time</p>
          ) : userRelationship === 'applied' ? (
            <Button href={`/job/${job.id}/${application?.id}`}>
              Manage application
            </Button>
          ) : userRelationship === 'coach' ? (
            <Button onClick={() => setShowApply(true)}>Apply now!</Button>
          ) : userRelationship === 'not-authenticated' ? (
            <Button href="/auth?mode=register">Sign up to apply</Button>
          ) : userRelationship === 'not-coach' ? (
            <Button href="/profile/edit?tab=2">
              Create a coach profile to apply
            </Button>
          ) : null}
          {userRelationship === 'owner' && (
            <Button href={`/job/${job?.id}/manage`}>Manage job</Button>
          )}
        </div>
      </div>
      <p>{job?.description}</p>
      {owner && (
        <SectionLayout
          title="About the client"
          className="pt-4 mt-4 border-t border-gray-300"
        >
          <ProfileOverview profile={owner} type="client" />
        </SectionLayout>
      )}
      {job && (
        <ApplyForm
          open={showApply}
          jobId={job.id}
          onClose={() => setShowApply(false)}
          onSubmit={(next) => router.push(`/job/${job.id}/${next}`)}
        />
      )}
    </PageLayout>
  )
}
export default withAuth(JobPage, { checkUser: false, checkProfile: false })
