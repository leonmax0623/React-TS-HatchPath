import dayjs from 'dayjs'
import { Field, FieldProps, Form, Formik } from 'formik'

import Button from 'components/common/Button'
import InputTimeRange from 'components/common/InputTimeRange'
import Switch from 'components/common/Switch'
import { useToast } from 'components/common/Toast'

import cn from 'util/classnames'
import { useAppDispatch } from 'util/store'
import { getDefaultAvailability } from 'util/time'
import Yup from 'util/yup'

import { updateProfile } from 'slices/profile'

import { CommonProps } from 'types/common'
import { AvailabilityDayType, ProfileType } from 'types/profile'

import { profilesApi } from 'services/profiles'

type AvailabilityFormProps = CommonProps & {
  profile: ProfileType
}
const AvailabilityForm = ({
  id,
  className,
  profile,
}: AvailabilityFormProps) => {
  const { toast, error } = useToast()
  const dispatch = useAppDispatch()
  const [invalidateProfile] = profilesApi.useInvalidateProfileMutation()

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        availability: getDefaultAvailability(),
      }}
      validationSchema={Yup.object({})}
      onSubmit={async ({ availability }) => {
        const response = await dispatch(
          updateProfile({
            id: profile.id,
            coach: {
              availability,
            },
          }),
        )
        invalidateProfile(profile.id)
        if (updateProfile.fulfilled.match(response)) {
          toast({
            title: 'Profile updated',
            description: 'Succesfully saved changes to your availability',
            type: 'success',
          })
        } else {
          error()
        }
      }}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form id={id} className={cn('flex flex-col gap-y-4', className)}>
          <Field name="availability">
            {({ field }: FieldProps) => (
              <>
                <dl>
                  {Object.values(field.value).map((obj, i) => {
                    const day = obj as AvailabilityDayType
                    return (
                      <div key={i} className="flex flex-row items-center my-2">
                        <dt className="min-w-30">
                          {dayjs().startOf('day').set('day', i).format('ddd')}
                        </dt>
                        <dd className="flex flex-row grow gap-x-3 items-center">
                          <Switch
                            value={field.value ? day.enabled : false}
                            onValueChange={(next) => {
                              setFieldValue(`availability.${i}.enabled`, next)
                            }}
                          />
                          {day.enabled && (
                            <InputTimeRange
                              value={
                                field.value
                                  ? {
                                      start: dayjs(
                                        day.start,
                                        'hh:mm A',
                                      ).toDate(),
                                      end: dayjs(day.end, 'hh:mm A').toDate(),
                                    }
                                  : undefined
                              }
                              onValueChange={(next) => {
                                setFieldValue(`availability.${i}`, {
                                  enabled: day.enabled,
                                  start: dayjs(next.start).format('hh:mm A'),
                                  end: dayjs(next.end).format('hh:mm A'),
                                })
                              }}
                            />
                          )}
                        </dd>
                      </div>
                    )
                  })}
                </dl>
              </>
            )}
          </Field>
          <Button className="mx-auto mt-4" type="submit" loading={isSubmitting}>
            Save changes
          </Button>
        </Form>
      )}
    </Formik>
  )
}
export default AvailabilityForm
