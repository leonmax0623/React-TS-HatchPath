import { Formik, Form, Field, FieldProps } from 'formik'

import Alert from 'components/common/Alert'
import Button from 'components/common/Button'
import InputText from 'components/common/InputText'

import cn from 'util/classnames'
import { GENERIC_ERROR, SUPPORT_EMAIL } from 'util/constants'
import { useAppDispatch } from 'util/store'
import Yup from 'util/yup'

import { login } from 'slices/user'

import { ProfileType } from 'types/profile'

type LoginFormProps = {
  className?: string
  onLogin: (profile: ProfileType | undefined) => void
  onPasswordReset: () => void
}
const LoginForm = ({
  className,
  onLogin,
  onPasswordReset,
}: LoginFormProps): JSX.Element => {
  const dispatch = useAppDispatch()

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={Yup.object({
        email: Yup.string().email().max(10000).required(),
        password: Yup.string().max(10000).required(),
      })}
      onSubmit={async ({ email, password }, { setSubmitting, setStatus }) => {
        setSubmitting(true)
        const response = await dispatch(login({ email, password }))
        setSubmitting(false)
        if (login.fulfilled.match(response)) {
          onLogin(response.payload.profile)
        } else {
          const err = response.payload
          switch (err) {
            case 'USER_DISABLED':
              setStatus({
                message: `This account has been disabled, please contact support at ${SUPPORT_EMAIL}`,
              })
              break
            case 'WRONG_AUTH':
              setStatus({
                message:
                  'Could not verify login info, please check your email or password.',
              })
              break
            default:
              setStatus(true)
              break
          }
        }
      }}
    >
      {({ touched, errors, isSubmitting, status, setStatus }) => (
        <Form
          className={cn('flex flex-col items-center', className)}
          onChange={() => setStatus()}
        >
          <Field name="email">
            {({ field }: FieldProps) => (
              <InputText
                {...field}
                className="mt-10"
                label="Email"
                type="email"
                error={touched.email ? errors.email : ''}
              />
            )}
          </Field>
          <Field name="password">
            {({ field }: FieldProps) => (
              <InputText
                {...field}
                className="mt-4"
                label="Password"
                type="password"
                error={touched.password ? errors.password : ''}
              />
            )}
          </Field>
          <Button
            className="mt-0.5 ml-auto"
            variant="text"
            size="xs"
            onClick={() => onPasswordReset()}
          >
            Forgot your password?
          </Button>
          {status && (
            <Alert
              className="mt-4"
              title="Could not login"
              description={status.message || GENERIC_ERROR}
            />
          )}
          <Button
            className="mt-10 !w-full"
            type="submit"
            loading={isSubmitting}
          >
            Login
          </Button>
        </Form>
      )}
    </Formik>
  )
}
export default LoginForm
