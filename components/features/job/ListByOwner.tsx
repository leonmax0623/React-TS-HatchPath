import { useAppSelector } from 'util/store'

import { CommonProps } from 'types/common'

import { jobsApi } from 'services/job'

import JobList from './List'

type JobListProps = CommonProps & {
  mode: 'open' | 'archive'
  emptyMessage?: string
}
const JobListByOwner = ({
  id,
  className,
  mode,
  emptyMessage = 'No jobs available',
}: JobListProps) => {
  const { user } = useAppSelector((state) => state.user)
  const { data: jobs } = jobsApi.useGetJobsByOwnerQuery({
    clientId: user?.id,
    isOpen: mode === 'open',
  })
  const jobsList = jobs || []

  return (
    <JobList
      id={id}
      className={className}
      jobs={jobsList}
      emptyMessage={emptyMessage}
    />
  )
}
export default JobListByOwner
