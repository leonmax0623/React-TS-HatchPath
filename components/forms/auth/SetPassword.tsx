import { Field, FieldProps, Form, Formik } from 'formik'

import Button from 'components/common/Button'
import InputText from 'components/common/InputText'
import { useToast } from 'components/common/Toast'

import cn from 'util/classnames'
import { useAppDispatch } from 'util/store'
import Yup from 'util/yup'

import { resetPassword } from 'slices/user'

import { CommonProps } from 'types/common'

type SetPasswordProps = CommonProps & {
  code: string
  onSuccess?: () => void
  onExpired?: () => void
}
const SetPassword = ({
  id,
  className,
  code,
  onSuccess = () => undefined,
  onExpired = () => undefined,
}: SetPasswordProps) => {
  const dispatch = useAppDispatch()
  const { error } = useToast()

  return (
    <Formik
      initialValues={{ password: '', confirm: '' }}
      validationSchema={Yup.object({
        password: Yup.string().min(6).max(10000).required(),
        confirm: Yup.string()
          .oneOf([Yup.ref('password')], 'this must match the password above')
          .required('please confirm your password'),
      })}
      onSubmit={async ({ password }) => {
        const response = await dispatch(resetPassword({ code, password }))
        if (resetPassword.fulfilled.match(response)) {
          onSuccess()
        } else {
          if (response.payload === 'EXPIRED') {
            onExpired()
          } else {
            error()
          }
        }
      }}
    >
      {({ isSubmitting, touched, errors }) => (
        <Form id={id} className={cn('flex flex-col', className)}>
          <h1 className="mb-5">Set your new password</h1>
          <Field name="password">
            {({ field }: FieldProps) => (
              <InputText
                {...field}
                className="w-full"
                label="Password"
                type="password"
                error={touched.password ? errors.password : ''}
              />
            )}
          </Field>
          <Field name="confirm">
            {({ field }: FieldProps) => (
              <InputText
                {...field}
                className="mt-4 w-full"
                label="Confirm password"
                type="password"
                error={touched.confirm ? errors.confirm : ''}
              />
            )}
          </Field>
          <Button className="mt-8 w-full" type="submit" loading={isSubmitting}>
            Set new password
          </Button>
        </Form>
      )}
    </Formik>
  )
}
export default SetPassword
