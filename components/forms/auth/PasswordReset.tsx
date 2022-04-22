import { useEffect } from 'react'

import { useFormik } from 'formik'

import Alert from 'components/common/Alert'
import Button from 'components/common/Button'
import InputText from 'components/common/InputText'
import Modal from 'components/common/Modal'

import { GENERIC_ERROR } from 'util/constants'
import { useAppDispatch } from 'util/store'
import Yup from 'util/yup'

import { sendResetPassword } from 'slices/user'

type PasswordResetFormProps = {
  open?: boolean
  onClose?: () => void
  onSent?: () => void
}
const PasswordResetForm = ({
  open = false,
  onClose = () => undefined,
  onSent = () => undefined,
}: PasswordResetFormProps): JSX.Element => {
  const dispatch = useAppDispatch()
  const {
    handleSubmit,
    handleChange,
    handleBlur,
    status,
    setStatus,
    values,
    errors,
    touched,
    isSubmitting,
    submitForm,
    resetForm,
  } = useFormik({
    initialValues: { email: '' },
    validationSchema: Yup.object({
      email: Yup.string().email().required(),
    }),
    onSubmit: async ({ email }, { setSubmitting, setStatus }) => {
      setSubmitting(true)
      const response = await dispatch(sendResetPassword(email))
      setSubmitting(false)
      if (sendResetPassword.rejected.match(response)) {
        const err = response.payload
        if (err === 'TOO_MANY_REQUESTS') {
          setStatus('You requested this too many times, please try again later')
        } else {
          setStatus(true)
        }
      } else {
        onSent()
      }
    },
  })

  useEffect(() => {
    resetForm()
  }, [open, resetForm])

  return (
    <Modal
      open={open}
      onClose={() => {
        resetForm()
        onClose()
      }}
      header="Reset password"
      footer={
        <>
          <Button
            color="secondary"
            onClick={() => {
              resetForm()
              onClose()
            }}
          >
            Cancel
          </Button>
          <Button
            className="ml-2"
            onClick={() => submitForm()}
            loading={isSubmitting}
          >
            Send
          </Button>
        </>
      }
    >
      <p className="mb-4">
        Input the email you signed up with and we&apos;ll send you instructions
        to reset your password
      </p>
      <form
        onChange={() => setStatus(undefined)}
        onSubmit={handleSubmit}
      >
        <InputText
          name="email"
          label="Your email"
          value={values.email}
          error={touched.email ? errors.email : ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {status && (
          <Alert
            className="mt-4"
            title="Could not reset password"
            description={typeof status === 'string' ? status : GENERIC_ERROR}
          />
        )}
      </form>
    </Modal>
  )
}
export default PasswordResetForm
