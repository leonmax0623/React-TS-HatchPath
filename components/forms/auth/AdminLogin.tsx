import { Formik, Form, Field, FieldProps } from 'formik'

import Alert from 'components/common/Alert'
import Button from 'components/common/Button'
import InputText from 'components/common/InputText'

import cn from 'util/classnames'
import { GENERIC_ERROR } from 'util/constants'
import { useAppDispatch } from 'util/store'
import Yup from 'util/yup'

import { adminLogin } from 'slices/user'

type AdminLoginFormProps = {
  className?: string
  onLogin: () => void
}
const AdminLoginForm = ({
  className,
  onLogin,
}: AdminLoginFormProps): JSX.Element => {
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
        const response = await dispatch(adminLogin({ email, password }))
        setSubmitting(false)
        if (adminLogin.fulfilled.match(response)) {
          onLogin()
        } else {
          const err = response.payload
          switch (err) {
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
export default AdminLoginForm
