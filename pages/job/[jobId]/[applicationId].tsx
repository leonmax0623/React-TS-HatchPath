import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import Alert from 'components/common/Alert'
import Button from 'components/common/Button'
import Tabs from 'components/common/Tabs'

import { useAppDispatch, useAppSelector } from 'util/store'
import { usdFormat } from 'util/string'

import { removeNotification } from 'slices/profile'

import { ApplicationType } from 'types/job'
import { ProgramType } from 'types/program'

import Messages from 'components/features/util/Messages'
import withAuth from 'components/hoc/withAuth'
import PageLayout from 'components/layouts/Page'
import SectionLayout from 'components/layouts/Section'
import { jobsApi } from 'services/job'
import { getProgramById } from 'services/program'

const ApplyPage: NextPage = () => {
  const router = useRouter()
  const { user } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  const {
    data: job,
    isLoading,
    isError,
  } = jobsApi.useGetJobQuery(router.query.jobId as string)
  const [sendMessage] = jobsApi.useSendApplicationMessageMutation()
  const [markRead, { isSuccess }] =
    jobsApi.useMarkApplicationMessageReadMutation()

  const [tab, setTab] = useState<number>(0)
  const [program, setProgram] = useState<ProgramType | undefined>(undefined)
  const application = useMemo<ApplicationType | undefined>(
    () =>
      job ? job.applications[router.query.applicationId as string] : undefined,
    [job, router],
  )
  useEffect(() => {
    if (application && !program) {
      getProgramById(application.program).then((program) => setProgram(program))
    }
  }, [application, program])
  useEffect(() => {
    setTab(router.query.tab === '1' ? 1 : 0)
  }, [router])

  useEffect(() => {
    if (tab === 1 && job && application && !isSuccess) {
      markRead({
        type: 'client',
        jobId: job.id,
        applicationId: application.id,
      })
      dispatch(
        removeNotification({
          id: `${job.id}-${application.id}`,
          type: 'coach',
        }),
      )
    }
  }, [job, application, tab, markRead, isSuccess, dispatch])

  const messagingStatus = useMemo<
    'enabled' | 'not-started' | 'disabled'
  >(() => {
    const fromClient =
      application &&
      user &&
      application.messages.some(({ author }) => author !== application.coach)
    if (!fromClient) {
      return 'not-started'
    } else if (application.isMessagingDisabled) {
      return 'disabled'
    } else {
      return 'enabled'
    }
  }, [application, user])

  return (
    <PageLayout
      title={job?.title}
      loading={isLoading}
      error={isError}
      notFound={!job || !application}
      contentClassName="flex flex-col"
    >
      <div className="flex flex-row justify-between items-center">
        <h1>
          <span className="block text-lg font-light">
            Manage your application
          </span>
          <span>{job?.title}</span>
        </h1>
        <Button
          href={`/job/${job?.id}`}
          leftIcon={{ icon: 'external-link' }}
          variant="link"
          target="_blank"
        >
          View job
        </Button>
      </div>
      {!job?.isOpen && job?.accepted && user && (
        <>
          {job.accepted.coach === user.id ? (
            <Alert
              className="my-2"
              title="Congrats!"
              description={
                <p>
                  You have been selected by the client for this job, click
                  <Link
                    href={`/enrollment/${job.accepted.enrollment}`}
                    passHref
                  >
                    <Button variant="link">here</Button>
                  </Link>
                  for more details
                </p>
              }
              type="success"
            />
          ) : (
            <Alert
              className="my-2"
              title="There are more jobs out there!"
              description="The client has decided to proceed with a different coach. Use the explore page to find more jobs to apply to."
            />
          )}
        </>
      )}
      <Tabs
        className="my-2"
        items={['Info', 'Messages']}
        value={tab}
        onValueChange={(next) => {
          router.push({
            query: {
              ...router.query,
              tab: next,
            },
          })
          setTab(next)
        }}
      />
      {tab === 0 ? (
        <div className="flex flex-col gap-y-8">
          <SectionLayout titleClassName="!font-normal" title="Cover letter">
            <p>{application?.coverLetter}</p>
          </SectionLayout>
          <SectionLayout titleClassName="!font-normal" title="Proposed price">
            {application?.price ? usdFormat.format(application?.price) : ''}
          </SectionLayout>
          <SectionLayout titleClassName="!font-normal" title="Program">
            <div className="flex flex-row justify-between items-center mb-1">
              <p className="font-semibold">{program?.title}</p>
              <Button
                href={`/program/${program?.id}`}
                target="_blank"
                leftIcon={{ icon: 'external-link' }}
                variant="link"
              >
                View program
              </Button>
            </div>
            <p>{program?.description}</p>
          </SectionLayout>
        </div>
      ) : (
        <Messages
          className="grow"
          messages={application?.messages || []}
          onSend={async (content) => {
            if (job && application && user) {
              await sendMessage({
                jobId: job.id,
                applicationId: application.id,
                content,
              })
            }
          }}
          disabled={messagingStatus !== 'enabled' || !job?.isOpen}
          disabledMessage={
            messagingStatus === 'not-started'
              ? 'messaging will be enabled after the client sends the first message'
              : 'messaging has been disabled'
          }
        />
      )}
    </PageLayout>
  )
}
export default withAuth(ApplyPage, { profileType: 'coach' })
