import Alert from 'components/common/Alert'
import Loader from 'components/common/Loader'

import cn from 'util/classnames'
import { GENERIC_ERROR } from 'util/constants'

import { CommonProps } from 'types/common'

import { enrollmentsApi } from 'services/enrollment'

import EnrollmentsList from './List'

type EnrollmentListByOwnerProps = CommonProps & {
  userId: string
  mode: 'active' | 'archive'
  type: 'client' | 'coach'
}
const EnrollmentListByOwner = ({
  id,
  className,
  userId,
  mode,
  type,
}: EnrollmentListByOwnerProps) => {
  const {
    data: enrollments,
    isLoading,
    isError,
  } = enrollmentsApi.useGetEnrollmentsByUserQuery({
    id: userId,
    type,
    active: mode === 'active',
  })

  return (
    <div id={id} className={cn('flex flex-col', className)}>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Alert title="Unexpected error" description={GENERIC_ERROR} />
      ) : null}
      {enrollments && enrollments.length > 0 && (
        <EnrollmentsList enrollments={enrollments} />
      )}
    </div>
  )
}
export default EnrollmentListByOwner
