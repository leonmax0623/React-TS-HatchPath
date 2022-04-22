import Link from 'next/link'

import dayjs from 'dayjs'

import Icon from 'components/common/Icon'
import Tooltip from 'components/common/Tooltip'

import cn from 'util/classnames'
import { useAppSelector } from 'util/store'

import { CommonProps } from 'types/common'
import { EnrollmentListType } from 'types/enrollment'

type EnrollmentListProps = CommonProps & {
  enrollments: EnrollmentListType[]
}
const EnrollmentList = ({
  id,
  className,
  enrollments,
}: EnrollmentListProps) => {
  const { user } = useAppSelector((state) => state.user)

  return (
    <ul id={id} className={cn('grid grid-cols-12 gap-8', className)}>
      {enrollments.map(({ enrollment, program, client }, idx) => (
        <li className="col-span-12 md:col-span-4" key={idx}>
          <Link href={`/enrollment/${enrollment.id}`} passHref={true}>
            <a className="flex flex-col py-2 px-4 w-full h-full rounded border border-gray-300 hover:border-gray-500">
              <div className="flex flex-row justify-between items-center">
                <h3>{program.title}</h3>
                {((user?.id === client.id && enrollment.unreadCoachMessage) ||
                  enrollment.unreadClientMessage) && (
                  <Tooltip label="Unread messages" wrapTrigger={true}>
                    <Icon icon="envelope" />
                  </Tooltip>
                )}
              </div>
              <div className="flex flex-row items-center">
                <p>
                  Started:{' '}
                  {dayjs(enrollment.createdTime).format('MMM DD, YYYY')}
                </p>
              </div>
            </a>
          </Link>
        </li>
      ))}
    </ul>
  )
}
export default EnrollmentList
