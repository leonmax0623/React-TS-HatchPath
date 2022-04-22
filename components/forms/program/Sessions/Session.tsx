import { useMemo } from 'react'

import { useFormik } from 'formik'

import Button from 'components/common/Button'
import InputArea from 'components/common/InputArea'
import InputText from 'components/common/InputText'
import Modal from 'components/common/Modal'
import { useToast } from 'components/common/Toast'

import { useAppSelector } from 'util/store'
import uuid from 'util/uuid'
import Yup from 'util/yup'

import { CommonProps } from 'types/common'
import { ProgramType, SessionType } from 'types/program'

import { programsApi } from 'services/program'

type SessionFormProps = CommonProps & {
  open?: boolean
  program: ProgramType
  session?: SessionType
  onClose?: () => void
  onSubmit?: () => void
  onRemove?: () => void
}
const SessionForm = ({
  id,
  className,
  open = false,
  program,
  session,
  onClose = () => undefined,
  onSubmit = () => undefined,
  onRemove = () => undefined,
}: SessionFormProps) => {
  const {
    user: { user },
  } = useAppSelector((state) => state)
  const { toast, error } = useToast()

  const [updateProgram, { isLoading: updating }] =
    programsApi.useUpdateProgramMutation()

  const initialValues = useMemo(
    () => ({
      title: session?.title || '',
      description: session?.description || '',
    }),
    [session],
  )

  const onRemoveSession = async () => {
    try {
      if (session) {
        await updateProgram({
          current: program,
          next: {
            sessions: program.sessions.filter((s) => s.id !== session.id),
          },
        }).unwrap()
        toast({
          title: 'Session deleted',
          description: 'Succesfully deleted session',
          type: 'success',
        })
        onRemove()
      }
    } catch {
      error()
    }
  }

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
    initialValues: initialValues,
    validationSchema: Yup.object({
      title: Yup.string().max(10000).required(),
      description: Yup.string().max(100000).required(),
    }),
    onSubmit: async ({ title, description }) => {
      if (user) {
        try {
          if (session) {
            await updateProgram({
              current: program,
              next: {
                sessions: program.sessions.map((s) =>
                  s.id === session.id
                    ? {
                        ...session,
                        title,
                        description,
                      }
                    : s,
                ),
              },
            }).unwrap()
            toast({
              title: 'Session updated',
              description: 'Succesfully saved changes for session',
              type: 'success',
            })
          } else {
            await updateProgram({
              current: program,
              next: {
                sessions: [
                  ...program.sessions,
                  {
                    id: uuid(),
                    title,
                    description,
                  },
                ],
              },
            }).unwrap()
            toast({
              title: 'Session created',
              description: 'Succesfully added new session',
              type: 'success',
            })
          }

          onSubmit()
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
        header={`${session ? 'Edit' : 'Add'} session`}
        footer={
          <>
            {session && (
              <Button
                className="mr-auto"
                color="error"
                loading={updating}
                onClick={() => onRemoveSession()}
              >
                Delete session
              </Button>
            )}
            <Button color="secondary" onClick={() => onClose()}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="session-form"
              onClick={() => submitForm()}
              loading={updating}
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
        </form>
      </Modal>
    </>
  )
}
export default SessionForm
