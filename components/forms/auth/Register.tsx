import { Formik, Form, Field, FieldProps } from 'formik'

import Alert from 'components/common/Alert'
import Button from 'components/common/Button'
import Checkbox from 'components/common/Checkbox'
import InputText from 'components/common/InputText'

import cn from 'util/classnames'
import { GENERIC_ERROR } from 'util/constants'
import { useAppDispatch } from 'util/store'
import Yup from 'util/yup'

import { register } from 'slices/user'

type RegisterFormProps = {
  className?: string
  onRegister: () => void
}
const RegisterForm = ({
  className,
  onRegister,
}: RegisterFormProps): JSX.Element => {
  const dispatch = useAppDispatch()
  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        confirm: '',
        terms: false,
        privacy: false,
      }}
      validationSchema={Yup.object({
        email: Yup.string().email().max(10000).required(),
        password: Yup.string().min(6).max(10000).required(),
        confirm: Yup.string()
          .oneOf([Yup.ref('password')], 'this must match your password above')
          .required('you must confirm your password'),
        terms: Yup.boolean().isTrue(
          'you must agree to the terms and conditions in order to sign up',
        ),
        privacy: Yup.boolean().isTrue(
          'you must agree to the terms and conditions in order to sign up',
        ),
      })}
      onSubmit={async ({ email, password }, { setStatus }) => {
        const response = await dispatch(register({ email, password }))
        if (register.fulfilled.match(response)) {
          onRegister()
        } else {
          const err = response.payload
          if (err === 'EMAIL_IN_USE') {
            setStatus({ message: 'This email is already in use' })
          } else {
            setStatus(true)
          }
        }
      }}
    >
      {({ touched, errors, status, setStatus, isSubmitting }) => (
        <Form
          className={cn('flex flex-col items-center', className)}
          onChange={() => setStatus()}
        >
          <Field name="email">
            {({ field }: FieldProps) => (
              <InputText
                {...field}
                className="mt-4"
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
          <Field name="confirm">
            {({ field }: FieldProps) => (
              <InputText
                {...field}
                className="mt-4"
                label="Confirm password"
                type="password"
                error={touched.confirm ? errors.confirm : ''}
              />
            )}
          </Field>
          <Field name="terms">
            {({ field }: FieldProps) => (
              <Checkbox
                {...field}
                className="mt-4"
                label={
                  <span>
                    You agree to our{' '}
                    <Button
                      className="py-0"
                      variant="link"
                      href="/legal/terms"
                      target="_blank"
                    >
                      terms and conditions
                    </Button>
                  </span>
                }
                error={touched.terms ? errors.terms : ''}
              />
            )}
          </Field>
          <Field name="privacy">
            {({ field }: FieldProps) => (
              <Checkbox
                {...field}
                className="mt-2"
                label={
                  <span>
                    You agree to our{' '}
                    <Button
                      className="py-0"
                      variant="link"
                      href="/legal/privacy"
                      target="_blank"
                    >
                      privacy policy
                    </Button>
                  </span>
                }
                error={touched.privacy ? errors.privacy : ''}
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
            Sign up
          </Button>
        </Form>
      )}
    </Formik>
  )
}
export default RegisterForm
