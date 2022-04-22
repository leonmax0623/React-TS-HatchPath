import { useState } from 'react'

import { Field, FieldProps, Form, Formik } from 'formik'

import Button from 'components/common/Button'
import InputAutoComplete from 'components/common/InputAutoComplete'
import InputSelect from 'components/common/InputSelect'
import InputTags from 'components/common/InputTags'
import InputText from 'components/common/InputText'
import { useToast } from 'components/common/Toast'

import { CITIES, TAGS } from 'util/constants'
import Yup from 'util/yup'

import { CommonProps } from 'types/common'

import { waitlistApi } from 'services/waitlist'

const CITY_OPTIONS = CITIES.map((city) => city.trim()).sort()
const TAG_OPTIONS = Object.values(TAGS)
  .flat()
  .map((tag) => tag.trim())
  .sort()

type WaitlistFormProps = CommonProps
const WaitlistForm = ({ id, className }: WaitlistFormProps) => {
  const { error } = useToast()
  const [mode, setMode] = useState<'initial' | 'form' | 'complete'>('initial')

  const [addWaitlist, { isLoading: adding }] =
    waitlistApi.useAddWaitlistMutation()

  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        city: '',
        tags: [],
        type: '',
      }}
      validationSchema={Yup.object({
        name: Yup.string().max(10000).required(),
        email: Yup.string().email().max(10000).required(),
        city: Yup.string().max(10000),
        tags: Yup.array(Yup.string().max(10000)),
        type: Yup.string()
          .oneOf(['client', 'coach'], 'what type of user are you?')
          .required('what type of user are you?'),
      })}
      onSubmit={async (values, { setFieldError }) => {
        try {
          await addWaitlist({
            name: values.name,
            email: values.email,
            city: values.city,
            tags: values.tags,
            type: values.type === 'client' ? 'client' : 'coach',
          }).unwrap()
          setMode('complete')
        } catch (err) {
          if (err === 'ALREADY_EXISTS') {
            setFieldError(
              'email',
              'this email has already been added to the waitlist',
            )
          } else {
            error()
          }
        }
      }}
    >
      {({ errors, touched }) => (
        <Form id={id} className={className}>
          {mode === 'initial' ? (
            <Button onClick={() => setMode('form')}>Join now</Button>
          ) : mode === 'form' ? (
            <div className="flex flex-col gap-y-4 p-4 w-80 bg-white rounded shadow">
              <Field name="name">
                {({ field }: FieldProps) => (
                  <InputText
                    {...field}
                    label="Your full name"
                    size="sm"
                    error={touched.name ? errors.name : ''}
                  />
                )}
              </Field>
              <Field name="email">
                {({ field }: FieldProps) => (
                  <InputText
                    {...field}
                    label="Your email"
                    size="sm"
                    error={touched.email ? errors.email : ''}
                  />
                )}
              </Field>
              <Field name="city">
                {({ field }: FieldProps) => (
                  <InputAutoComplete
                    label="What city are you in?"
                    error={touched.city ? errors.city : ''}
                    options={CITY_OPTIONS}
                    size="sm"
                    {...field}
                  />
                )}
              </Field>
              <Field name="tags">
                {({ field }: FieldProps) => (
                  <InputTags
                    label="What are you interested in?"
                    error={
                      touched.tags && typeof errors.tags === 'string'
                        ? errors.tags
                        : ''
                    }
                    options={TAG_OPTIONS}
                    isUnique={true}
                    size="sm"
                    {...field}
                  />
                )}
              </Field>

              <Field name="type">
                {({ field }: FieldProps) => (
                  <InputSelect
                    {...field}
                    label="What type of user are you?"
                    options={[
                      { label: 'Client', value: 'client' },
                      { label: 'Coach', value: 'coach' },
                    ]}
                    size="sm"
                    error={touched.type ? errors.type : ''}
                  />
                )}
              </Field>
              <Button type="submit" size="sm" loading={adding}>
                Submit
              </Button>
            </div>
          ) : (
            <p className="py-2 px-4 text-sm font-bold text-white uppercase">
              Thank you!
            </p>
          )}
        </Form>
      )}
    </Formik>
  )
}
export default WaitlistForm
