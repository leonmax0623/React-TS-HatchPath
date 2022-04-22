import Loader from 'components/common/Loader'

import cn from 'util/classnames'

import { CommonProps } from 'types/common'

import { jobsApi } from 'services/job'

import JobList from './List'

type JobSearchProps = CommonProps & {
  search: string
}
const JobSearch = ({ id, className, search }: JobSearchProps) => {
  const { data: jobs, isLoading } = jobsApi.useSearchJobsQuery(search)

  return (
    <div id={id} className={cn('flex flex-col gap-y-2', className)}>
      {isLoading && <Loader className="mx-auto" />}
      {jobs?.length ? (
        <JobList jobs={jobs} />
      ) : (
        <p className="text-lg">No jobs match your search</p>
      )}
    </div>
  )
}
export default JobSearch
