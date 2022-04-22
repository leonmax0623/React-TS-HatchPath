import { useFormik } from 'formik'

import Button from 'components/common/Button'
import InputArea from 'components/common/InputArea'
import InputTags from 'components/common/InputTags'
import InputText from 'components/common/InputText'
import Modal from 'components/common/Modal'
import { useToast } from 'components/common/Toast'

import { TAGS_LIST } from 'util/constants'
import { useAppSelector } from 'util/store'
import Yup, { currencyRegex } from 'util/yup'

import { CommonProps } from 'types/common'

import { programsApi } from 'services/program'

type ProgramFormProps = CommonProps & {
  open?: boolean
  onClose?: () => void
  onSubmit?: (id: string) => void
}
const ProgramForm = ({
  id,
  className,
  open = false,
  onClose = () => undefined,
  onSubmit = () => undefined,
}: ProgramFormProps) => {
  const {
    user: { user },
  } = useAppSelector((state) => state)
  const { toast, error } = useToast()

  const [createProgram, { isLoading: creating }] =
    programsApi.useCreateProgramMutation()

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
      title: '',
      description: '',
      tags: [],
      pricePerSession: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().max(10000).required(),
      description: Yup.string().max(100000).required(),
      tags: Yup.array(Yup.string().max(10000)),
      pricePerSession: Yup.string()
        .max(10000)
        .matches(currencyRegex, 'price must be a valid dollar amount')
        .required('price is a required field'),
    }),
    onSubmit: async ({ title, description, tags, pricePerSession }) => {
      if (user) {
        try {
          const response = await createProgram({
            owner: user.id,
            title,
            description,
            tags,
            pricePerSession: parseFloat(pricePerSession),
          }).unwrap()
          toast({
            title: 'Program created',
            description: 'Succesfully created new program',
            type: 'success',
          })
          onSubmit(response.id)
        } catch (err) {
          error()
        }
      }
    },
  })

  return (
    <>
      <Modal
        id={id}
        className={className}
        footerClassName="flex flex-row items-center gap-x-2"
        open={open}
        onClose={onClose}
        size="lg"
        header="Create program"
        footer={
          <>
            <Button color="secondary" onClick={() => onClose()}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="program-form"
              onClick={() => submitForm()}
              loading={creating}
            >
              Submit
            </Button>
          </>
        }
      >
        <form
          id="program-form"
          className="flex flex-col gap-y-2"
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
            label="Price per session"
            name="pricePerSession"
            error={touched.pricePerSession ? errors.pricePerSession : ''}
            type="number"
            leftIcon={{
              icon: 'dollar-sign',
            }}
            value={values.pricePerSession}
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
        </form>
      </Modal>
    </>
  )
}
export default ProgramForm
