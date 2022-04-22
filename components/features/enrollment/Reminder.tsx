import { useMemo } from 'react'

import dayjs from 'dayjs'

import Alert from 'components/common/Alert'

import { useAppSelector } from 'util/store'

import { CommonProps } from 'types/common'
import { EnrollmentType } from 'types/enrollment'

type ReminderProps = CommonProps & {
  enrollment: EnrollmentType
}
const Reminder = ({ id, className, enrollment }: ReminderProps) => {
  const { profile } = useAppSelector((state) => state.profile)
  const mode = useMemo(() => {
    if (enrollment.sessions.every(({ time }) => !time)) {
      return 'unscheduled'
    } else if (
      enrollment.sessions.every(({ time }) => time && time < dayjs().valueOf())
    ) {
      return 'completed'
    } else if (
      enrollment.sessions.some(
        ({ time, clientAgreed, coachAgreed }) =>
          time &&
          ((!clientAgreed && profile?.id === enrollment.client) ||
            (!coachAgreed && profile?.id === enrollment.coach)),
      )
    ) {
      return 'waiting'
    } else {
    }
  }, [enrollment, profile])
  const upcoming = useMemo(() => {
    const next = enrollment.sessions.find(
      ({ time }) => !time || time > dayjs().valueOf(),
    )
    return next
  }, [enrollment])

  return (
    <div id={id} className={className}>
      {mode === 'unscheduled' ? (
        <Alert
          title="No sessions scheduled"
          description="Schedule your first session to get started with this program!"
          type="warning"
        />
      ) : mode === 'completed' ? (
        <Alert
          title="Program completed"
          description="Congrats! You've succesfully completed this program"
          type="success"
        />
      ) : mode === 'waiting' ? (
        <Alert
          title="Session time proposed"
          description="There's a session waiting for your confirmation, check it out below"
          type="warning"
        />
      ) : null}
      {upcoming?.clientAgreed && upcoming?.coachAgreed ? (
        <Alert
          className="mt-2"
          title="Upcoming session"
          description={`You have a session upcoming at ${dayjs(
            upcoming.time,
          ).format('MMM DD, YYYY - hh:mm A')} for ${upcoming.title}`}
          type="info"
        />
      ) : !upcoming?.time ? (
        <Alert
          className="mt-2"
          title="Book your next session"
          description={`Your next session ${upcoming?.title} is not scheduled yet, find a time that works!`}
          type="info"
        />
      ) : null}
    </div>
  )
}
export default Reminder
