import cn from 'util/classnames'

import { CommonProps } from 'types/common'
import { JobType } from 'types/job'

import JobCard from './Card'

type JobListProps = CommonProps & {
  jobs: JobType[]
  emptyMessage?: string
}
const JobList = ({
  id,
  className,
  jobs,
  emptyMessage = 'No jobs available',
}: JobListProps) => {
  return (
    <div id={id} className={cn('', className)}>
      {jobs.length > 0 ? (
        <ul className="grid grid-cols-12 gap-8">
          {jobs.map((job, idx) => (
            <li className="col-span-12 md:col-span-4" key={idx}>
              <JobCard job={job} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">{emptyMessage}</p>
      )}
    </div>
  )
}
export default JobList
