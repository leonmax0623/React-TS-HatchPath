import { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import dayjs from 'dayjs'

import Button from 'components/common/Button'
import Tabs from 'components/common/Tabs'

import { useAppDispatch, useAppSelector } from 'util/store'

import { removeNotification } from 'slices/profile'

import { EnrollmentType } from 'types/enrollment'
import { ProfileType } from 'types/profile'
import { ProgramType } from 'types/program'

import Reminder from 'components/features/enrollment/Reminder'
import Schedule from 'components/features/enrollment/Schedule'
import Messages from 'components/features/util/Messages'
import withAuth from 'components/hoc/withAuth'
import Page from 'components/layouts/Page'
import SectionLayout from 'components/layouts/Section'
import { enrollmentsApi } from 'services/enrollment'

const EnrollmentPage: NextPage = () => {
  const { profile } = useAppSelector((state) => state.profile)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { data, isLoading, isError } = enrollmentsApi.useGetEnrollmentQuery(
    router.query.enrollmentId as string,
  )
  const [markRead, { isSuccess }] =
    enrollmentsApi.useMarkEnrollmentMessageReadMutation()
  const [sendMessage] = enrollmentsApi.useSendEnrollmentMessageMutation()

  const [tab, setTab] = useState<number>(0)

  const { enrollment, program, coach, client } = useMemo<{
    enrollment?: EnrollmentType
    program?: ProgramType
    coach?: ProfileType
    client?: ProfileType
  }>(() => {
    if (data) {
      return data
    } else {
      return {
        enrollment: undefined,
        program: undefined,
        coach: undefined,
        client: undefined,
      }
    }
  }, [data])
  useEffect(() => {
    if (tab === 1 && enrollment && !isSuccess && profile) {
      markRead({
        enrollmentId: enrollment.id,
        type: profile.id === enrollment.client ? 'coach' : 'client',
      })
      dispatch(
        removeNotification({
          id: enrollment.id,
          type: profile?.mode,
        }),
      )
    }
  }, [tab, enrollment, profile, isSuccess, markRead, dispatch])

  return (
    <Page
      title={program?.title}
      loading={isLoading}
      error={isError}
      notFound={!enrollment}
      contentClassName="flex flex-col gap-y-6"
    >
      {enrollment && program && client && coach && (
        <>
          <div className="flex flex-row justify-between items-center">
            <div>
              <h1>{program?.title}</h1>
              <p>
                Enrolled {dayjs(enrollment?.createdTime).format('MMM DD, YYYY')}
              </p>
            </div>
            <Button
              variant="link"
              href={`/program/${program?.id}`}
              target="_blank"
              leftIcon={{ icon: 'external-link' }}
            >
              View program description
            </Button>
          </div>
          <Tabs
            items={['Home', 'Messages']}
            value={tab}
            onValueChange={setTab}
          />
          {tab === 0 ? (
            <>
              <Reminder enrollment={enrollment} />
              <Schedule
                enrollment={enrollment}
                program={program}
                coach={coach}
                client={client}
              />
              {profile?.mode === 'client' ? (
                <SectionLayout
                  title="Your coach"
                  className="py-3 px-4 bg-teal-100 rounded"
                >
                  <div>
                    <div className="flex flex-row items-center">
                      {coach?.profileImage?.url && (
                        <div className="flex flex-col justify-center items-center mr-2">
                          <Image
                            className="rounded-full"
                            src={coach?.profileImage?.url}
                            alt="coach"
                            height={50}
                            width={50}
                          />
                        </div>
                      )}
                      <p className="text-xl font-semibold">
                        {coach?.firstName} {coach?.lastName}
                        {coach?.coach?.businessName && (
                          <span className="block text-sm font-light">
                            ({coach?.coach?.businessName})
                          </span>
                        )}
                      </p>
                      <Button
                        className="ml-auto"
                        href={`/profile/${coach?.id}`}
                        target="_blank"
                        variant="link"
                        leftIcon={{
                          icon: 'external-link',
                        }}
                      >
                        Visit coach profile
                      </Button>
                    </div>
                    <p className="mt-2 line-clamp-2">
                      {coach?.coach?.description}
                    </p>
                  </div>
                </SectionLayout>
              ) : (
                <SectionLayout
                  title="Your client"
                  className="py-3 px-4 bg-teal-100 rounded"
                >
                  <div>
                    <div className="flex flex-row items-center">
                      {client?.profileImage?.url && (
                        <div className="flex flex-col justify-center items-center mr-2">
                          <Image
                            className="rounded-full"
                            src={client?.profileImage?.url}
                            alt="client"
                            height={50}
                            width={50}
                          />
                        </div>
                      )}
                      <p className="text-xl font-semibold">
                        {client?.firstName} {client?.lastName}
                      </p>
                      <Button
                        className="ml-auto"
                        href={`/profile/${client?.id}`}
                        target="_blank"
                        variant="link"
                        leftIcon={{
                          icon: 'external-link',
                        }}
                      >
                        Visit client profile
                      </Button>
                    </div>
                    <p className="mt-2 line-clamp-2">
                      {client?.client?.description}
                    </p>
                  </div>
                </SectionLayout>
              )}
            </>
          ) : (
            <Messages
              className="grow"
              messages={enrollment.messages || []}
              onSend={async (message) => {
                if (profile && enrollment) {
                  sendMessage({
                    enrollmentId: enrollment.id,
                    content: message,
                    userId: profile.id,
                  })
                }
              }}
            />
          )}
        </>
      )}
    </Page>
  )
}
export default withAuth(EnrollmentPage, {
  profileType: 'any',
})
