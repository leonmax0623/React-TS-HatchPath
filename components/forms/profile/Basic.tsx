import dayjs from 'dayjs'
import { Field, FieldProps, Form, Formik } from 'formik'

import Button from 'components/common/Button'
import InputAutoComplete from 'components/common/InputAutoComplete'
import InputDate from 'components/common/InputDate'
import InputImage from 'components/common/InputImage'
import InputSelect from 'components/common/InputSelect'
import InputText from 'components/common/InputText'
import { useToast } from 'components/common/Toast'

import cn from 'util/classnames'
import { CITIES } from 'util/constants'
import { useAppDispatch } from 'util/store'
import { timezonesList } from 'util/timezone'
import Yup from 'util/yup'

import { updateProfile } from 'slices/profile'

import { CommonProps } from 'types/common'
import { ProfileType } from 'types/profile'

import { profilesApi } from 'services/profiles'

type ProfileBasicFormProps = CommonProps & {
  profile: ProfileType
}
const ProfileBasicForm = ({
  id,
  className,
  profile,
}: ProfileBasicFormProps) => {
  const { toast, error } = useToast()
  const dispatch = useAppDispatch()
  const [invalidateProfile] = profilesApi.useInvalidateProfileMutation()

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        dateOfBirth: profile?.dateOfBirth
          ? dayjs(profile.dateOfBirth).toDate()
          : dayjs().subtract(18, 'year').toDate(),
        city: profile?.city || '',
        timezone: profile?.timezone || dayjs.tz.guess(),
        profileImage: profile?.profileImage || null,
      }}
      validationSchema={Yup.object({
        firstName: Yup.string().max(10000).required('this is a required field'),
        lastName: Yup.string().max(10000).required('this is a required field'),
        dateOfBirth: Yup.date()
          .max(
            dayjs().subtract(18, 'year').toDate(),
            'you must be at least 18 years old to sign up',
          )
          .required('this is a required field'),
        city: Yup.string().max(10000),
        profileImage: Yup.object().nullable(),
      })}
      onSubmit={async ({
        firstName,
        lastName,
        dateOfBirth,
        city,
        timezone,
        profileImage,
      }) => {
        const response = await dispatch(
          updateProfile({
            id: profile.id,
            firstName,
            lastName,
            dateOfBirth: dayjs(dateOfBirth).valueOf(),
            city,
            timezone,
            profileImage,
          }),
        )
        invalidateProfile(profile.id)
        if (updateProfile.fulfilled.match(response)) {
          toast({
            title: 'Profile updated',
            description: 'Succesfully saved changes to your profile',
            type: 'success',
          })
        } else {
          error()
        }
      }}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form id={id} className={cn('flex flex-col gap-y-4', className)}>
          <Field name="firstName">
            {({ field }: FieldProps) => (
              <InputText
                label="First name"
                error={touched.firstName ? errors.firstName : ''}
                {...field}
              />
            )}
          </Field>
          <Field name="lastName">
            {({ field }: FieldProps) => (
              <InputText
                label="Last name"
                error={touched.lastName ? errors.lastName : ''}
                {...field}
              />
            )}
          </Field>
          <Field name="dateOfBirth">
            {({ field }: FieldProps) => (
              <InputDate
                label="Date of birth"
                error={
                  touched.dateOfBirth && typeof errors.dateOfBirth === 'string'
                    ? errors.dateOfBirth
                    : ''
                }
                showShortcuts={false}
                {...field}
              />
            )}
          </Field>
          <Field name="city">
            {({ field }: FieldProps) => (
              <InputAutoComplete
                label="What city are you in?"
                error={touched.city ? errors.city : ''}
                options={CITIES}
                {...field}
              />
            )}
          </Field>
          <Field name="timezone">
            {({ field }: FieldProps) => (
              <InputSelect
                label="What timezone are you in?"
                error={touched.timezone ? errors.timezone : ''}
                options={timezonesList}
                {...field}
              />
            )}
          </Field>
          <Field name="profileImage">
            {({ field }: FieldProps) => (
              <InputImage
                className="mt-4 text-center"
                labelClassName="!text-center"
                label="Upload your picture"
                {...field}
              />
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
export default ProfileBasicForm
