import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import Button from 'components/common/Button'
import Drawer from 'components/common/Drawer'
import Icon from 'components/common/Icon'
import PopoverMenu from 'components/common/PopoverMenu'
import Tabs from 'components/common/Tabs'
import { useToast } from 'components/common/Toast'

import { useAppDispatch, useAppSelector } from 'util/store'
import { usdFormat } from 'util/string'

import { removeNotification } from 'slices/profile'

import { CommonProps } from 'types/common'
import { ApplicationType, JobType } from 'types/job'
import { ProfileType } from 'types/profile'
import { ProgramType } from 'types/program'

import { jobsApi } from 'services/job'

import ProfileOverview from '../profile/Overview'
import Messages from '../util/Messages'

type ApplicationPanelProps = CommonProps & {
  open?: boolean
  onClose?: () => void
  job: JobType
  application?: ApplicationType
  program?: ProgramType
  coach?: ProfileType
}
const ApplicationPanel = ({
  id,
  className,
  open,
  onClose = () => undefined,
  job,
  coach,
  program,
  application,
}: ApplicationPanelProps) => {
  const { error, toast } = useToast()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [tab, setTab] = useState<number>(0)
  const { user } = useAppSelector((state) => state.user)
  const [sendMessage] = jobsApi.useSendApplicationMessageMutation()
  const [markRead, { isSuccess }] =
    jobsApi.useMarkApplicationMessageReadMutation()
  const [acceptApplication, { isLoading: creating }] =
    jobsApi.useAcceptApplicationMutation()
  const [updateMessagingDisabled] = jobsApi.useUpdateMessagingDisabledMutation()

  useEffect(() => {
    setTab(router.query?.tab === '1' ? 1 : 0)
  }, [open, router])

  const onAccept = async () => {
    if (coach && program && application && user) {
      try {
        const { enrollmentId } = await acceptApplication({
          jobId: job.id,
          applicationId: application.id,
        }).unwrap()
        router.push(`/enrollment/${enrollmentId}`)
      } catch {
        error()
      }
    }
  }
  const onUpdateMessagingDisabled = async (isDisabled: boolean) => {
    if (coach && program && application && user) {
      try {
        await updateMessagingDisabled({
          jobId: job.id,
          applicationId: application.id,
          isDisabled,
        }).unwrap()
        toast({
          title: isDisabled ? 'Messaging disabled' : 'Messaging enabled',
          description: `Messaging has been succesfully ${
            isDisabled ? 'disabled' : 'enabled'
          } for this application`,
          type: 'success',
        })
      } catch {
        error()
      }
    }
  }

  useEffect(() => {
    if (application && tab === 1 && !isSuccess) {
      markRead({
        type: 'coach',
        jobId: job.id,
        applicationId: application.id,
      })
      dispatch(
        removeNotification({
          id: `${job.id}-${application.id}`,
          type: 'client',
        }),
      )
    }
  }, [application, tab, isSuccess, markRead, job, dispatch])

  return (
    <Drawer
      id={id}
      className={className}
      open={open}
      onClose={() => {
        onClose()
      }}
      showCloseButton={true}
      size="lg"
      header="Review application"
      bodyClassName="flex flex-col"
    >
      {application && program && coach && user && (
        <>
          <div className="flex flex-row justify-between">
            <h1>
              {coach.firstName} {coach.lastName}
              {coach.coach?.businessName && (
                <span className="block text-sm font-light">
                  ({coach.coach?.businessName})
                </span>
              )}
            </h1>
            <div className="flex flex-row">
              {!job.accepted && (
                <div className="flex flex-row">
                  <Button loading={creating} onClick={onAccept}>
                    Accept
                  </Button>
                </div>
              )}
              <PopoverMenu
                items={[
                  {
                    label: application.isMessagingDisabled
                      ? 'Enable messages'
                      : 'Disable Messages',
                    value: application.isMessagingDisabled
                      ? 'Enable messages'
                      : 'disable',
                  },
                ]}
                onSelect={(key) => onUpdateMessagingDisabled(key === 'disable')}
                trigger={{
                  children: <Icon icon="ellipsis-v" />,
                  variant: 'text',
                }}
              />
            </div>
          </div>
          <Tabs
            className="my-2"
            items={['Application', 'Messages']}
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
            <dl className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-12 md:col-span-6">
                <dt className="font-light">Proposed program</dt>
                <dd>
                  <Link href={`/program/${program.id}`} passHref>
                    <Button
                      variant="link"
                      leftIcon={{ icon: 'external-link' }}
                      target="_blank"
                    >
                      {program.title}
                    </Button>
                  </Link>
                </dd>
              </div>
              <div className="col-span-12">
                <dt className="font-light">Proposed price</dt>
                <dd className="grid grid-cols-12 gap-4">
                  <p className="col-span-6">
                    {usdFormat.format(application.price)}{' '}
                    <span className="block text-sm font-light text-gray-600">
                      per session
                    </span>
                  </p>
                  <p className="col-span-6">
                    {usdFormat.format(
                      application.price * program.sessions.length,
                    )}{' '}
                    <span className="block text-sm font-light text-gray-600">
                      full program
                    </span>
                  </p>
                </dd>
              </div>
              <div className="col-span-12">
                <dt className="font-light">Cover letter</dt>
                <dd>{application.coverLetter}</dd>
              </div>
              <div className="col-span-12">
                <dt className="font-light">About the coach</dt>
                <dd>
                  <ProfileOverview profile={coach} type="coach" />
                </dd>
              </div>
            </dl>
          ) : (
            <Messages
              className="grow"
              messages={application?.messages || []}
              onSend={async (content) => {
                await sendMessage({
                  jobId: job.id,
                  applicationId: application.id,
                  content,
                })
              }}
              disabled={application?.isMessagingDisabled || !job?.isOpen}
            />
          )}
        </>
      )}
    </Drawer>
  )
}
export default ApplicationPanel
