import Link from 'next/link'
import { useMemo } from 'react'

import dayjs from 'dayjs'

import Alert from 'components/common/Alert'
import Icon from 'components/common/Icon'
import Loader from 'components/common/Loader'
import Tooltip from 'components/common/Tooltip'

import cn from 'util/classnames'
import { GENERIC_ERROR } from 'util/constants'
import { useAppSelector } from 'util/store'

import { CommonProps } from 'types/common'

import { jobsApi } from 'services/job'

type ApplicationsListProps = CommonProps & {
  mode: 'open' | 'archive'
  emptyMessage?: string
}
const ApplicationsList = ({
  id,
  className,
  mode,
  emptyMessage = 'No applications to show',
}: ApplicationsListProps) => {
  const { user } = useAppSelector((state) => state.user)

  const {
    data: jobs,
    isLoading,
    isError,
  } = jobsApi.useGetJobsByCoachQuery({
    coachId: user?.id,
    isOpen: mode === 'open',
  })
  const applications = useMemo(() => {
    if (user && jobs) {
      return jobs.map((job) => ({
        job,
        application: Object.values(job.applications).find(
          ({ coach }) => coach === user.id,
        )!,
      }))
    } else {
      return []
    }
  }, [jobs, user])

  return (
    <div id={id} className={cn('relative', className)}>
      {isLoading && (
        <Loader
          className="absolute top-0 left-0 w-full h-full bg-white/80"
          type="full"
        />
      )}
      {isError && (
        <Alert
          className="my-2"
          title="Unexpected problem"
          description={GENERIC_ERROR}
        />
      )}
      {applications.length > 0 ? (
        <ul className="grid grid-cols-12 gap-8">
          {applications.map(({ job, application }, idx) => (
            <li className="col-span-12 md:col-span-4" key={idx}>
              <Link href={`/job/${job.id}/${application.id}`} passHref>
                <a className="flex flex-col py-2 px-4 w-full h-full rounded border border-gray-300 hover:border-gray-500">
                  <div className="flex flex-row justify-between items-center">
                    <h3>{job.title}</h3>
                    {job.isOpen && job.unreadClientMessage.length > 0 && (
                      <Tooltip
                        label="Unread messages from client"
                        wrapTrigger={true}
                      >
                        <Icon icon="envelope" />
                      </Tooltip>
                    )}
                  </div>
                  <p>
                    Submitted: {dayjs(job.createdTime).format('MMM DD, YYYY')}
                  </p>
                  {!job.isOpen && user && job.accepted && (
                    <>
                      {job.accepted.coach === user.id ? (
                        <div className="flex flex-row gap-x-1 items-center mt-4 text-green-800">
                          <Icon icon="check-circle" />
                          <p>Accepted!</p>
                        </div>
                      ) : (
                        <div className="flex flex-row gap-x-1 items-center mt-4 text-gray-600">
                          <Icon icon="times-circle" />
                          <p>Declined</p>
                        </div>
                      )}
                    </>
                  )}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">{emptyMessage}</p>
      )}
    </div>
  )
}
export default ApplicationsList
