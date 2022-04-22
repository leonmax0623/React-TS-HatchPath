import Link from 'next/link'

import dayjs from 'dayjs'

import Icon from 'components/common/Icon'
import Tooltip from 'components/common/Tooltip'

import cn from 'util/classnames'
import { useAppSelector } from 'util/store'
import { usdFormat } from 'util/string'

import { CommonProps } from 'types/common'
import { JobType } from 'types/job'

type JobCardProps = CommonProps & {
  job: JobType
}
const JobCard = ({ id, className, job }: JobCardProps) => {
  const { user } = useAppSelector((state) => state.user)
  return (
    <div id={id} className={cn('rounded cursor-pointer', className)}>
      <Link href={`/job/${job.id}`} passHref={true}>
        <a className="flex flex-col py-2 px-4 w-full h-full rounded border border-gray-300 hover:border-gray-500">
          <div className="flex flex-row justify-between items-center">
            <h3>{job.title}</h3>
            {job.unreadCoachMessage.length > 0 && (
              <Tooltip label="Unread messages from coaches" wrapTrigger={true}>
                <Icon icon="envelope" />
              </Tooltip>
            )}
          </div>
          <div className="flex flex-row items-center">
            <p>Created: {dayjs(job.createdTime).format('MMM DD, YYYY')}</p>
            {job.budget && (
              <p className="pl-2 ml-2 border-l border-gray-300">
                Budget: {usdFormat.format(job.budget)}
              </p>
            )}
          </div>
          {user && user.id === job.owner && (
            <p>{Object.keys(job.applications).length} applications</p>
          )}
        </a>
      </Link>
    </div>
  )
}
export default JobCard
