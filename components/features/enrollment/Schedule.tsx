import { useState } from 'react'

import dayjs from 'dayjs'

import Accordion from 'components/common/Accordion'
import Button from 'components/common/Button'
import Icon from 'components/common/Icon'
import { useToast } from 'components/common/Toast'
import Tooltip from 'components/common/Tooltip'

import cn from 'util/classnames'
import { useAppSelector } from 'util/store'

import { CommonProps } from 'types/common'
import { EnrollmentType } from 'types/enrollment'
import { ProfileType } from 'types/profile'
import { ProgramType } from 'types/program'

import ScheduleForm from 'components/forms/Schedule'
import { enrollmentsApi } from 'services/enrollment'

type ScheduleProps = CommonProps & {
  enrollment: EnrollmentType
  program: ProgramType
  coach: ProfileType
  client: ProfileType
}
const Schedule = ({
  id,
  className,
  enrollment,
  program,
  coach,
  client,
}: ScheduleProps) => {
  const { toast, error } = useToast()
  const { profile } = useAppSelector((state) => state.profile)
  const [open, setOpen] = useState<string | undefined>(undefined)
  const [acceptTime, { isLoading: accepting }] =
    enrollmentsApi.useAcceptTimeMutation()
  const [cancelTime, { isLoading: cancelling }] =
    enrollmentsApi.useCancelTimeMutation()

  const onAccept = async (sessionId: string) => {
    try {
      acceptTime({
        enrollmentId: enrollment.id,
        sessionId,
      }).unwrap()
      toast({
        title: 'Session booked!',
        description: 'Succesfully confirmed the time for this session.',
        type: 'success',
      })
    } catch {
      error()
    }
  }

  const onCancel = async (sessionId: string) => {
    try {
      cancelTime({
        enrollmentId: enrollment.id,
        sessionId,
      }).unwrap()
      toast({
        title: 'Session canceled',
        description: 'Succesfully canceled the time for this session',
        type: 'success',
      })
    } catch {
      error()
    }
  }

  return (
    <>
      <Accordion
        id={id}
        className={cn('flex flex-col', className)}
        headerClassName="bg-gray-50 hover:!bg-gray-100"
        labelClassName="font-normal"
        items={
          enrollment.sessions.map(
            (
              { id, title, description, time, clientAgreed, coachAgreed },
              idx,
            ) => {
              let mode = 'unscheduled'
              if (time) {
                if (clientAgreed && coachAgreed) {
                  mode = 'scheduled'
                } else if (
                  (profile?.id === coach.id && !coachAgreed && clientAgreed) ||
                  (profile?.id === client.id && coachAgreed && !clientAgreed)
                ) {
                  mode = 'proposed'
                } else if (
                  (profile?.id === coach.id && coachAgreed && !clientAgreed) ||
                  (profile?.id === client.id && !coachAgreed && clientAgreed)
                ) {
                  mode = 'waiting'
                }
              }
              return {
                label: (
                  <span
                    key={idx}
                    className="flex flex-row gap-x-2 items-center"
                  >
                    {mode === 'unscheduled' ? (
                      <Tooltip label="Not scheduled" wrapTrigger={true}>
                        <Icon
                          icon="exclamation-circle"
                          className="text-yellow-600"
                        />
                      </Tooltip>
                    ) : mode === 'proposed' ? (
                      <Tooltip label="Does this time work?" wrapTrigger={true}>
                        <Icon
                          icon="question-circle"
                          className="text-yellow-600"
                        />
                      </Tooltip>
                    ) : mode === 'waiting' ? (
                      <Tooltip label="Waiting for response" wrapTrigger={true}>
                        <Icon icon="ellipsis-h" className="text-gray-600" />
                      </Tooltip>
                    ) : (
                      <Tooltip label="Scheduled!" wrapTrigger={true}>
                        <Icon icon="check-circle" className="text-green-600" />
                      </Tooltip>
                    )}
                    {title}
                  </span>
                ),
                content: (
                  <div key={idx}>
                    <div className="flex flex-row justify-between items-center mb-4 w-full">
                      {mode === 'unscheduled' ? (
                        <>
                          <p className="font-bold">Session not scheduled yet</p>
                          <Button onClick={() => setOpen(id)}>
                            Propose a time
                          </Button>
                        </>
                      ) : mode === 'proposed' ? (
                        <>
                          <p className="font-bold">
                            Does {dayjs(time).format('MMM DD, YYYY - hh:mm A')}{' '}
                            work for you?
                          </p>
                          <div className="flex flex-row gap-x-1 items-center">
                            <Button onClick={() => setOpen(id)} variant="text">
                              Propose alternative
                            </Button>
                            <Button
                              onClick={() => onAccept(id)}
                              loading={accepting}
                            >
                              Accept time
                            </Button>
                          </div>
                        </>
                      ) : mode === 'waiting' ? (
                        <p className="font-bold">
                          Proposed{' '}
                          {dayjs(time).format('MMM DD, YYYY - hh:mm A')},
                          waiting for it to be confirmed
                        </p>
                      ) : (
                        <>
                          <p className="font-bold">
                            Scheduled for{' '}
                            {dayjs(time).format('MMM DD, YYYY - hh:mm A')}
                          </p>
                          {(profile?.id === enrollment.coach ||
                            dayjs(time).diff(dayjs(), 'day') > 1) && (
                            <Button
                              onClick={() => onCancel(id)}
                              loading={cancelling}
                            >
                              Cancel time
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                    <p>{description}</p>
                  </div>
                ),
              }
            },
          ) || []
        }
      />
      <ScheduleForm
        open={!!open}
        onClose={() => setOpen(undefined)}
        sessionId={open}
        program={program}
        enrollment={enrollment}
        coach={coach}
        client={client}
      />
    </>
  )
}
export default Schedule
