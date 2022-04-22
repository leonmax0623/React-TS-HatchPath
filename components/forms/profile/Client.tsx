import dayjs from 'dayjs'
import { Field, FieldProps, Form, Formik } from 'formik'

import Button from 'components/common/Button'
import InputArea from 'components/common/InputArea'
import InputTags from 'components/common/InputTags'
import { useToast } from 'components/common/Toast'

import cn from 'util/classnames'
import { TAGS_LIST } from 'util/constants'
import { useAppDispatch } from 'util/store'
import Yup from 'util/yup'

import { updateProfile } from 'slices/profile'

import { CommonProps } from 'types/common'
import { ClientType } from 'types/profile'

import { profilesApi } from 'services/profiles'

type ProfileClientFormProps = CommonProps & {
  profileId: string
  client?: ClientType
}
const ProfileClientForm = ({
  id,
  className,
  profileId,
  client,
}: ProfileClientFormProps) => {
  const { toast, error } = useToast()
  const dispatch = useAppDispatch()
  const [invalidateProfile] = profilesApi.useInvalidateProfileMutation()

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        tags: client?.tags || [],
        description: client?.description || '',
      }}
      validationSchema={Yup.object({
        tags: Yup.array(Yup.string().max(10000)),
        description: Yup.string().max(10000),
      })}
      onSubmit={async ({ tags, description }) => {
        const response = await dispatch(
          updateProfile({
            id: profileId,
            client: {
              createdTime: client?.createdTime || dayjs().valueOf(),
              tags,
              description,
            },
          }),
        )
        invalidateProfile(profileId)
        if (updateProfile.fulfilled.match(response)) {
          if (client) {
            toast({
              title: 'Profile updated',
              description: 'Succesfully saved changes to your profile',
              type: 'success',
            })
          } else {
            toast({
              title: 'Profile created',
              description: 'Welcome to the HatchPath family!',
              type: 'success',
            })
          }
        } else {
          error()
        }
      }}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form id={id} className={cn('flex flex-col gap-y-4', className)}>
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
          <Button className="mx-auto mt-4" type="submit" loading={isSubmitting}>
            {client ? 'Save changes' : 'Create client profile'}
          </Button>
        </Form>
      )}
    </Formik>
  )
}
export default ProfileClientForm
