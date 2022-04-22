import { Field, FieldProps, Form, Formik } from 'formik'

import Button from 'components/common/Button'
import InputImage from 'components/common/InputImage'
import { useToast } from 'components/common/Toast'

import cn from 'util/classnames'

import { CommonProps } from 'types/common'
import { ProgramType } from 'types/program'

import { programsApi } from 'services/program'

type ProgramBannerFormProps = CommonProps & {
  program: ProgramType
}
const ProgramBannerForm = ({
  id,
  className,
  program,
}: ProgramBannerFormProps) => {
  const { toast, error } = useToast()
  const [updateProgram, { isLoading: updating }] =
    programsApi.useUpdateProgramMutation()
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        banner: program.banner,
      }}
      onSubmit={async ({ banner }) => {
        try {
          await updateProgram({
            current: program,
            next: {
              banner,
            },
          }).unwrap()
          toast({
            title: 'Program banner updated',
            description:
              'Succesfully saved the new banner image for this program',
            type: 'success',
          })
        } catch {
          error()
        }
      }}
    >
      {() => (
        <Form
          id={id}
          className={cn('flex flex-col gap-y-4 items-center', className)}
        >
          <Field name="banner">
            {({ field }: FieldProps) => (
              <InputImage
                {...field}
                label="Banner image for your program"
                className="text-center"
                labelClassName="!text-center"
              />
            )}
          </Field>
          <Button className="mx-auto mt-8" type="submit" loading={updating}>
            Save banner image
          </Button>
        </Form>
      )}
    </Formik>
  )
}
export default ProgramBannerForm
