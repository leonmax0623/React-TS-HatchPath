import { useFormik } from 'formik'

import Button from 'components/common/Button'
import InputArea from 'components/common/InputArea'
import InputTags from 'components/common/InputTags'
import InputText from 'components/common/InputText'
import Modal from 'components/common/Modal'
import Switch from 'components/common/Switch'
import { useToast } from 'components/common/Toast'

import { TAGS_LIST } from 'util/constants'
import { useAppSelector } from 'util/store'
import Yup, { currencyRegex } from 'util/yup'

import { CommonProps } from 'types/common'
import { JobType } from 'types/job'

import { jobsApi } from 'services/job'

type JobFormProps = CommonProps & {
  job?: JobType
  open?: boolean
  onClose?: () => void
  onSubmit?: (id: string) => void
}
const JobForm = ({
  id,
  className,
  job,
  open = false,
  onClose = () => undefined,
  onSubmit = () => undefined,
}: JobFormProps) => {
  const {
    user: { user },
  } = useAppSelector((state) => state)
  const { toast, error } = useToast()

  const [createJob, { isLoading: creating }] = jobsApi.useCreateJobMutation()
  const [updateJob, { isLoading: updating }] = jobsApi.useUpdateJobMutation()

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
      title: job?.title || '',
      description: job?.description || '',
      tags: job?.tags || [],
      budget: job?.budget.toLocaleString('en-US') || '',
      isOpen: job?.isOpen || false,
    },
    validationSchema: Yup.object({
      title: Yup.string().max(10000).required(),
      description: Yup.string().max(100000).required(),
      tags: Yup.array(Yup.string().max(10000)),
      budget: Yup.string()
        .max(10000)
        .matches(currencyRegex, 'budget must be a valid dollar amount')
        .required('budget is a required field'),
      isOpen: Yup.bool(),
    }),
    onSubmit: async ({ title, description, tags, budget, isOpen }) => {
      if (user) {
        try {
          if (job) {
            const response = await updateJob({
              current: job,
              next: {
                title,
                description,
                tags,
                budget: parseFloat(budget),
                isOpen,
              },
            }).unwrap()
            toast({
              title: 'Job updated',
              description: 'Succesfully saved changes to this job',
              type: 'success',
            })
            onSubmit(response)
          } else {
            const response = await createJob({
              owner: user.id,
              title,
              description,
              tags,
              budget: parseFloat(budget),
              isOpen,
            }).unwrap()
            toast({
              title: 'Job created',
              description: 'Succesfully created new job',
              type: 'success',
            })
            onSubmit(response.id)
          }
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
      header="Create job"
      footer={
        <>
          <Button color="secondary" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="job-form"
            onClick={() => submitForm()}
            loading={creating || updating}
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
        <InputText
          name="title"
          label="Title"
          value={values.title}
          error={touched.title ? errors.title : ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <InputArea
          name="description"
          label="Description"
          value={values.description}
          error={touched.description ? errors.description : ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <InputText
          label="Program budget"
          name="budget"
          error={touched.budget ? errors.budget : ''}
          type="number"
          leftIcon={{
            icon: 'dollar-sign',
          }}
          value={values.budget}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <InputTags
          name="tags"
          label="Tags"
          value={values.tags}
          error={
            touched.tags && typeof errors.tags === 'string' ? errors.tags : ''
          }
          options={TAGS_LIST}
          onChange={handleChange}
          onBlur={handleBlur}
          lowerCase={true}
        />
        <Switch
          className="mt-2"
          name="isOpen"
          label="is this job open for applications?"
          value={values.isOpen}
          onChange={handleChange}
        />
      </form>
    </Modal>
  )
}
export default JobForm
