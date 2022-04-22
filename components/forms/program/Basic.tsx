import { Field, FieldProps, Form, Formik } from 'formik'

import Button from 'components/common/Button'
import InputArea from 'components/common/InputArea'
import InputTags from 'components/common/InputTags'
import InputText from 'components/common/InputText'
import { useToast } from 'components/common/Toast'

import cn from 'util/classnames'
import { TAGS_LIST } from 'util/constants'
import Yup, { currencyRegex } from 'util/yup'

import { CommonProps } from 'types/common'
import { ProgramType } from 'types/program'

import { programsApi } from 'services/program'

type ProgramBasicFormProps = CommonProps & {
  program: ProgramType
}
const ProgramBasicForm = ({
  id,
  className,
  program,
}: ProgramBasicFormProps) => {
  const { toast, error } = useToast()
  const [updateProgram, { isLoading: updating }] =
    programsApi.useUpdateProgramMutation()
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        title: program.title,
        description: program.description,
        tags: program.tags,
        pricePerSession: program.pricePerSession.toLocaleString('en-US'),
      }}
      validationSchema={Yup.object({
        title: Yup.string().max(10000).required(),
        description: Yup.string().max(100000).required(),
        pricePerSession: Yup.string()
          .max(10000)
          .matches(currencyRegex, 'price must be a valid dollar amount')
          .required(),
        tags: Yup.array(Yup.string().max(10000)),
      })}
      onSubmit={async ({ title, description, tags, pricePerSession }) => {
        try {
          await updateProgram({
            current: program,
            next: {
              title,
              description,
              tags,
              pricePerSession: parseFloat(pricePerSession),
            },
          }).unwrap()
          toast({
            title: 'Program updated',
            description: 'Succesfully saved changes to this program',
            type: 'success',
          })
        } catch {
          error()
        }
      }}
    >
      {({ errors, touched }) => (
        <Form id={id} className={cn('flex flex-col gap-y-4', className)}>
          <Field name="title">
            {({ field }: FieldProps) => (
              <InputText
                {...field}
                label="Title"
                error={touched.title ? errors.title : ''}
              />
            )}
          </Field>
          <Field name="description">
            {({ field }: FieldProps) => (
              <InputArea
                {...field}
                label="Description"
                error={touched.description ? errors.description : ''}
              />
            )}
          </Field>
          <Field name="tags">
            {({ field }: FieldProps) => (
              <InputTags
                {...field}
                label="Tags"
                error={
                  touched.tags && typeof errors.tags === 'string'
                    ? errors.tags
                    : ''
                }
                options={TAGS_LIST}
                lowerCase={true}
              />
            )}
          </Field>
          <Field name="pricePerSession">
            {({ field }: FieldProps) => (
              <InputText
                {...field}
                label="Price per session"
                error={touched.pricePerSession ? errors.pricePerSession : ''}
                type="number"
                leftIcon={{
                  icon: 'dollar-sign',
                }}
              />
            )}
          </Field>
          <Button className="mx-auto" type="submit" loading={updating}>
            Save changes
          </Button>
        </Form>
      )}
    </Formik>
  )
}
export default ProgramBasicForm
