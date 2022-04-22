import { Field, FieldProps, Form, Formik } from 'formik'

import Alert from 'components/common/Alert'
import Button from 'components/common/Button'
import Switch from 'components/common/Switch'
import { useToast } from 'components/common/Toast'

import cn from 'util/classnames'

import { CommonProps } from 'types/common'
import { ProgramType } from 'types/program'

import { programsApi } from 'services/program'

type ProgramSettingsFormProps = CommonProps & {
  program: ProgramType
}
const ProgramSettingsForm = ({
  id,
  className,
  program,
}: ProgramSettingsFormProps) => {
  const { toast, error } = useToast()
  const [updateProgram, { isLoading: updating }] =
    programsApi.useUpdateProgramMutation()

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        isOpen: program.isOpen,
      }}
      onSubmit={async ({ isOpen }) => {
        try {
          await updateProgram({
            current: program,
            next: {
              isOpen,
            },
          }).unwrap()
          toast({
            title: 'Program updated',
            description: 'Succesfully saved settings changes',
            type: 'success',
          })
        } catch {
          error()
        }
      }}
    >
      {({ errors, touched }) => (
        <Form id={id} className={cn('flex flex-col gap-y-6', className)}>
          <Field name="isOpen">
            {({ field }: FieldProps) => (
              <>
                {program.sessions.length <= 0 && (
                  <Alert
                    title="No sessions in program"
                    description="You can't accept any new clients until you have at least one session"
                    type="warning"
                  />
                )}
                <Switch
                  {...field}
                  label="accepting new clients"
                  error={touched.isOpen ? errors.isOpen : ''}
                  disabled={program.sessions.length <= 0}
                />
              </>
            )}
          </Field>

          <div className="flex flex-col items-center mt-8">
            <Button type="submit" loading={updating}>
              Save settings
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  )
}
export default ProgramSettingsForm
