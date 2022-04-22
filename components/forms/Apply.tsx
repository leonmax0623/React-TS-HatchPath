import { useMemo } from 'react'

import { useFormik } from 'formik'

import Button from 'components/common/Button'
import InputArea from 'components/common/InputArea'
import InputSelect from 'components/common/InputSelect'
import InputText from 'components/common/InputText'
import Modal from 'components/common/Modal'
import { useToast } from 'components/common/Toast'

import { keyBy } from 'util/list'
import { useAppSelector } from 'util/store'
import { usdFormat } from 'util/string'
import Yup, { currencyRegex } from 'util/yup'

import { CommonProps } from 'types/common'

import { jobsApi } from 'services/job'
import { programsApi } from 'services/program'

type ApplyFormProps = CommonProps & {
  jobId: string
  open?: boolean
  onClose?: () => void
  onSubmit?: (id: string) => void
}
const ApplyForm = ({
  id,
  className,
  jobId,
  open = false,
  onClose = () => undefined,
  onSubmit = () => undefined,
}: ApplyFormProps) => {
  const {
    user: { user },
  } = useAppSelector((state) => state)
  const { toast, error } = useToast()

  const { data: programs } = programsApi.useGetProgramsByOwnerQuery(
    user?.id || '',
  )
  const programsMap = useMemo(
    () => (programs ? keyBy(programs, 'id') : {}),
    [programs],
  )

  const [createApplication, { isLoading: creating }] =
    jobsApi.useCreateApplicationMutation()

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    handleReset,
    submitForm,
    values,
    touched,
    errors,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      program: '',
      coverLetter: '',
      price: '',
    },
    validationSchema: Yup.object({
      program: Yup.string().max(10000).required(),
      coverLetter: Yup.string().max(100000).required(),
      price: Yup.string()
        .max(10000)
        .matches(currencyRegex, 'price must be a valid dollar amount')
        .required('price is a required field'),
    }),
    onSubmit: async ({ program, coverLetter, price }) => {
      if (user) {
        try {
          const response = await createApplication({
            jobId: jobId,
            programId: program,
            coverLetter,
            price: parseFloat(price),
          }).unwrap()
          toast({
            title: 'Application submitted',
            description: 'Succesfully applied to this job',
            type: 'success',
          })
          onSubmit(response.applicationId)
        } catch (err) {
          error()
        }
      }
    },
  })

  return (
    <Modal
      id={id}
      className={className}
      footerClassName="flex flex-row items-center gap-x-2"
      open={open}
      onClose={onClose}
      size="lg"
      header="Apply to job"
      footer={
        <>
          <Button color="secondary" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="job-form"
            onClick={() => submitForm()}
            loading={creating}
          >
            Submit
          </Button>
        </>
      }
    >
      <form
        id="job-form"
        className="flex flex-col gap-y-4"
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        <InputSelect
          name="program"
          label="Program"
          value={values.program}
          error={touched.program ? errors.program : ''}
          onChange={handleChange}
          options={(programs || []).map(({ title, id }) => ({
            label: title,
            value: id,
          }))}
        />
        <InputArea
          name="coverLetter"
          label="Cover letter"
          value={values.coverLetter}
          error={touched.coverLetter ? errors.coverLetter : ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <InputText
          label="Proposed price per session"
          name="price"
          error={touched.price ? errors.price : ''}
          type="number"
          leftIcon={{
            icon: 'dollar-sign',
          }}
          helper={
            values.price && values.program && programsMap[values.program]
              ? `proposing ${usdFormat.format(
                  programsMap[values.program].sessions.length *
                    parseFloat(values.price),
                )} for the program`
              : ''
          }
          value={values.price}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </form>
    </Modal>
  )
}
export default ApplyForm
