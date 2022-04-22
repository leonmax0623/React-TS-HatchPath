import { useRouter } from 'next/router'

import dayjs from 'dayjs'
import { Field, FieldProps, Form, Formik } from 'formik'

import Button from 'components/common/Button'
import InputArea from 'components/common/InputArea'
import InputMultiText from 'components/common/InputMultiText'
import InputSelect from 'components/common/InputSelect'
import InputTags from 'components/common/InputTags'
import InputText from 'components/common/InputText'
import { useToast } from 'components/common/Toast'

import cn from 'util/classnames'
import { TAGS_LIST } from 'util/constants'
import { useAppDispatch } from 'util/store'
import Yup, { isValidUrl } from 'util/yup'

import { updateProfile } from 'slices/profile'

import { CommonProps } from 'types/common'
import { CoachType } from 'types/profile'

import { profilesApi } from 'services/profiles'

type ProfileCoachFormProps = CommonProps & {
  profileId: string
  coach?: CoachType
}
const ProfileCoachForm = ({
  id,
  className,
  profileId,
  coach,
}: ProfileCoachFormProps) => {
  const { toast, error } = useToast()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [invalidateProfile] = profilesApi.useInvalidateProfileMutation()

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        businessName: coach?.businessName || '',
        tags: coach?.tags || [],
        description: coach?.description || '',
        links: coach?.links || [],
        numPreviousClients: coach?.numPreviousClients || 0,
        education: coach?.education || [],
        certifications: coach?.certifications || [],
        experience: coach?.experience || [],
      }}
      validationSchema={Yup.object({
        businessName: Yup.string().max(10000),
        tags: Yup.array(Yup.string().max(10000)),
        description: Yup.string().max(10000),
        links: Yup.array(
          Yup.string()
            .max(10000)
            .test('is-url', 'this is not a valid url', (value) =>
              isValidUrl(value),
            ),
        ),
        numPreviousClients: Yup.number().required(
          'you must state how many previous clients you have had',
        ),
        education: Yup.array(Yup.string()),
        certifications: Yup.array(Yup.string()),
        experience: Yup.array(Yup.string()),
      })}
      onSubmit={async ({
        businessName,
        tags,
        description,
        links,
        numPreviousClients,
        education,
        certifications,
        experience,
      }) => {
        const response = await dispatch(
          updateProfile({
            id: profileId,
            coach: {
              createdTime: coach?.createdTime || dayjs().valueOf(),
              businessName,
              tags,
              description,
              links,
              numPreviousClients,
              education,
              certifications,
              experience,
            },
          }),
        )
        invalidateProfile(profileId)
        if (updateProfile.fulfilled.match(response)) {
          if (coach) {
            toast({
              title: 'Profile updated',
              description: 'Succesfully saved changes to your profile',
              type: 'success',
            })
          } else {
            toast({
              title: 'Coach application created',
              description:
                'Succesfully applied to be a coach on HatchPath, we will review your application and get back to you soon!',
              type: 'success',
            })
            router.push('/coach/review')
          }
        } else {
          error()
        }
      }}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form id={id} className={cn('flex flex-col gap-y-8', className)}>
          <Field name="businessName">
            {({ field }: FieldProps) => (
              <InputText
                label="Business name"
                error={touched.businessName ? errors.businessName : ''}
                {...field}
              />
            )}
          </Field>
          <Field name="tags">
            {({ field }: FieldProps) => (
              <InputTags
                label="Tags"
                error={
                  touched.tags && typeof errors.tags === 'string'
                    ? errors.tags
                    : ''
                }
                options={TAGS_LIST}
                isUnique={true}
                lowerCase={true}
                {...field}
              />
            )}
          </Field>
          <Field name="description">
            {({ field }: FieldProps) => (
              <InputArea
                label="Describe yourself"
                error={touched.description ? errors.description : ''}
                rows={4}
                characterLimit={1000}
                {...field}
              />
            )}
          </Field>
          <Field name="links">
            {({ field }: FieldProps) => (
              <InputMultiText
                label="Your links"
                error={
                  errors.links
                    ? 'all links must be valid urls starting with http:// or https://'
                    : ''
                }
                placeholder="https://"
                {...field}
              />
            )}
          </Field>
          <Field name="numPreviousClients">
            {({ field }: FieldProps) => (
              <InputSelect
                label="Number of previous clients"
                error={
                  touched.numPreviousClients &&
                  typeof errors.numPreviousClients === 'string'
                    ? errors.numPreviousClients
                    : ''
                }
                options={[
                  {
                    label: '0 - 5',
                    value: 0,
                  },
                  {
                    label: '5 - 10',
                    value: 5,
                  },
                  {
                    label: 'More than 10',
                    value: 10,
                  },
                ]}
                {...field}
              />
            )}
          </Field>
          <Field name="education">
            {({ field }: FieldProps) => (
              <InputMultiText
                label="Your education history"
                error={
                  touched.education && typeof errors.education === 'string'
                    ? errors.education
                    : ''
                }
                placeholder="institution - year"
                {...field}
              />
            )}
          </Field>
          <Field name="certifications">
            {({ field }: FieldProps) => (
              <InputMultiText
                label="Your certifications"
                error={
                  touched.certifications &&
                  typeof errors.certifications === 'string'
                    ? errors.certifications
                    : ''
                }
                placeholder="certification name - year"
                {...field}
              />
            )}
          </Field>
          <Field name="experience">
            {({ field }: FieldProps) => (
              <InputMultiText
                label="Your experience"
                error={
                  touched.experience && typeof errors.experience === 'string'
                    ? errors.experience
                    : ''
                }
                placeholder="experience - year"
                {...field}
              />
            )}
          </Field>
          <Button className="mx-auto mt-4" type="submit" loading={isSubmitting}>
            {coach?.decision === 'rejected'
              ? 'Reapply to be a coach'
              : coach
              ? 'Save changes'
              : 'Apply to be a coach'}
          </Button>
        </Form>
      )}
    </Formik>
  )
}
export default ProfileCoachForm
