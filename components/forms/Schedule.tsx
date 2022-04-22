import { useEffect, useMemo } from 'react'

import dayjs from 'dayjs'
import { useFormik } from 'formik'

import Button from 'components/common/Button'
import InputDate from 'components/common/InputDate'
import InputSelect from 'components/common/InputSelect'
import Modal from 'components/common/Modal'
import { useToast } from 'components/common/Toast'

import { useAppSelector } from 'util/store'
import Yup from 'util/yup'

import { CommonProps } from 'types/common'
import { EnrollmentType } from 'types/enrollment'
import { AvailabilityType, ProfileType } from 'types/profile'
import { ProgramType } from 'types/program'

import { enrollmentsApi } from 'services/enrollment'

type ScheduleFormProps = CommonProps & {
  open?: boolean
  onClose?: () => void
  enrollment: EnrollmentType
  program: ProgramType
  coach: ProfileType
  client: ProfileType
  sessionId?: string
}
const ScheduleForm = ({
  id,
  className,
  open = false,
  onClose = () => undefined,
  coach,
  client,
  enrollment,
  sessionId,
}: ScheduleFormProps) => {
  const { error, toast } = useToast()
  const { profile } = useAppSelector((state) => state.profile)
  const [proposeTime] = enrollmentsApi.useProposeTimeMutation()

  const {
    handleChange,
    handleBlur,
    submitForm,
    resetForm,
    values,
    touched,
    errors,
    isSubmitting,
    setFieldValue,
  } = useFormik({
    initialValues: {
      date: dayjs().startOf('day').add(1, 'day').toDate(),
      time: '',
    },
    validationSchema: Yup.object({
      date: Yup.date().required(),
      time: Yup.string().required(),
    }),
    onSubmit: async ({ date, time }) => {
      if (sessionId) {
        try {
          const combined = dayjs.tz(
            `${dayjs(date).format('MM-DD-YYYY')} ${time}`,
            'MM-DD-YYYY hh:mm A',
            profile?.timezone,
          )
          await proposeTime({
            enrollmentId: enrollment.id,
            sessionId,
            time: combined.valueOf(),
          }).unwrap()
          toast({
            title: 'Proposed time',
            description:
              'Succesfully proposed this time for the session, check back later to see if it has been agreed to.',
            type: 'success',
          })
          onClose()
        } catch {
          error()
        }
      }
    },
  })

  useEffect(() => resetForm(), [open, resetForm])

  const times = useMemo<{ label: string; value: string }[]>(() => {
    const options: { label: string; value: string }[] = []

    const date = dayjs(values.date)
    const dayOfWeek = dayjs(values.date).day()
    const availability =
      coach.coach?.availability[dayOfWeek as keyof AvailabilityType]
    const startTime = availability
      ? dayjs(availability.start, 'hh:mm A')
          .set('year', date.year())
          .set('month', date.month())
          .set('date', date.date())
      : undefined
    const endTime = availability
      ? dayjs(availability.end, 'hh:mm A')
          .set('year', date.year())
          .set('month', date.month())
          .set('date', date.date())
      : undefined
    const startOfDay = dayjs(values.date).startOf('day')
    for (let i = 0; i < 48; i++) {
      const time = startOfDay.add(i * 30, 'minute')
      const isCoachAvailable = !coach.unavailableTimes.some(
        (unavailable) =>
          Math.abs(dayjs(unavailable).diff(time, 'minute')) <= 60,
      )
      const isClientAvailable = !client.unavailableTimes.some(
        (unavailable) =>
          Math.abs(dayjs(unavailable).diff(time, 'minute')) <= 60,
      )
      const isCoachScheduleAvailable =
        availability?.enabled &&
        startTime &&
        endTime &&
        time >= startTime &&
        time <= endTime
      if (
        isCoachAvailable &&
        isClientAvailable &&
        (profile?.id === coach.id || isCoachScheduleAvailable)
      ) {
        options.push({
          label: time.format('hh:mm A'),
          value: time.format('hh:mm A'),
        })
      }
    }
    return options
  }, [coach, profile, values.date, client])

  return (
    <Modal
      id={id}
      className={className}
      open={open}
      onClose={onClose}
      header="Propose a time"
      footer={
        <Button
          onClick={() => {
            if (times.length > 0) {
              submitForm()
            }
          }}
          disabled={times.length <= 0}
          loading={isSubmitting}
          type="submit"
          form="schedule-form"
        >
          Submit
        </Button>
      }
    >
      <form id="schedule-form" className="flex flex-col gap-y-4">
        <InputDate
          label="Date"
          name="date"
          value={values.date}
          error={
            touched.date && typeof touched.date === 'string'
              ? (errors.date as string)
              : ''
          }
          onChange={handleChange}
          onBlur={handleBlur}
          minDate={new Date()}
          showShortcuts={false}
        />
        {times.length > 0 ? (
          <InputSelect
            options={times}
            value={values.time}
            label="Time"
            helper={`time will be in the ${profile?.timezone} timezone`}
            onValueChange={(next) => setFieldValue('time', next, true)}
            error={errors.time}
          />
        ) : (
          <p className="my-4 text-center text-gray-400">
            No times are available on this day
          </p>
        )}
      </form>
    </Modal>
  )
}
export default ScheduleForm
