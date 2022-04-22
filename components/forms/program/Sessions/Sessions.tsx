import { useState } from 'react'

import Button, { IconButton } from 'components/common/Button'
import DragList from 'components/common/DragList'
import Loader from 'components/common/Loader'
import { useToast } from 'components/common/Toast'
import Tooltip from 'components/common/Tooltip'

import cn from 'util/classnames'
import { listEquals } from 'util/list'

import { CommonProps } from 'types/common'
import { ProgramType, SessionType } from 'types/program'

import { programsApi } from 'services/program'

import SessionForm from './Session'

type ProgramSessionsFormProps = CommonProps & {
  program: ProgramType
}
const ProgramSessionsForm = ({
  id,
  className,
  program,
}: ProgramSessionsFormProps) => {
  const [updateProgram, { isLoading: updating }] =
    programsApi.useUpdateProgramMutation()

  const { toast, error } = useToast()

  const [showEdit, setShowEdit] = useState<SessionType | boolean>(false)

  const onReorder = async (next: SessionType[]) => {
    if (
      !listEquals(
        program.sessions.map(({ id }) => id),
        next.map(({ id }) => id),
      )
    ) {
      try {
        updateProgram({
          current: program,
          next: {
            sessions: next,
          },
        }).unwrap()
        toast({
          title: 'Sessions saved',
          description: 'Succesfully saved session order',
          type: 'success',
        })
      } catch {
        error()
      }
    }
  }

  return (
    <div
      id={id}
      className={cn('flex flex-col gap-y-4 items-center', className)}
    >
      <div className="relative w-full">
        {updating && (
          <Loader
            type="full"
            className="absolute after:top-0 z-20 bg-white opacity-80"
          />
        )}
        {program.sessions.length > 0 && (
          <DragList
            className="w-full"
            itemClassName="bg-white py-3 px-3 shadow rounded border border-gray-100 mt-3"
            items={program.sessions.map((session, idx) => ({
              id: session.id,
              content: (
                <div className="flex flex-row grow items-center" key={idx}>
                  <div className="grow">
                    <p className="font-semibold">{session.title}</p>
                    <p>{session.description}</p>
                  </div>
                  <Tooltip label="Edit session" wrapTrigger={true}>
                    <IconButton
                      icon={{ icon: 'edit' }}
                      ariaLabel="Edit session"
                      variant="text"
                      size="sm"
                      onClick={() => setShowEdit(session)}
                    />
                  </Tooltip>
                </div>
              ),
              data: session,
            }))}
            onValueChange={(next) => {
              onReorder(
                next
                  .filter(({ data }) => data)
                  .map(({ data }) => data as SessionType),
              )
            }}
          />
        )}
      </div>
      <Button
        className="mx-auto mt-8"
        onClick={() => setShowEdit(true)}
        leftIcon={{ icon: 'plus' }}
        variant="outlined"
      >
        Add session
      </Button>
      <SessionForm
        open={!!showEdit}
        program={program}
        session={typeof showEdit !== 'boolean' ? showEdit : undefined}
        onClose={() => setShowEdit(false)}
        onSubmit={() => setShowEdit(false)}
        onRemove={() => setShowEdit(false)}
      />
    </div>
  )
}
export default ProgramSessionsForm
