import { useRouter } from 'next/router'
import { useState } from 'react'

import PopoverMenu from 'components/common/PopoverMenu'
import { useToast } from 'components/common/Toast'

import { useAppSelector } from 'util/store'

import { CommonProps } from 'types/common'

import JobForm from 'components/forms/Job'
import { jobsApi } from 'services/job'

type InviteButtonProps = CommonProps & {
  programId?: string
  coachId: string
}
const InviteButton = ({
  id,
  className,
  programId,
  coachId,
}: InviteButtonProps) => {
  const { error, toast } = useToast()
  const router = useRouter()
  const { user } = useAppSelector((state) => state.user)

  const [showCreate, setShowCreate] = useState<boolean>(false)
  const { data: jobs, isLoading: jobsLoading } = jobsApi.useGetJobsByOwnerQuery(
    {
      clientId: user?.id,
      isOpen: true,
    },
  )
  const [invite, { isLoading: inviting }] = jobsApi.useInviteMutation()

  const onInvite = async (jobId: string, goToJob?: boolean) => {
    if (coachId) {
      try {
        await invite({
          jobId: jobId,
          programId: programId,
          coachId: coachId,
        }).unwrap()
        toast({
          title: 'Invited!',
          description: 'Succesfully sent an invite to your job',
          type: 'success',
        })
        if (goToJob) {
          router.push(`/job/${jobId}`)
        }
      } catch {
        error()
      }
    }
  }

  return (
    <>
      <PopoverMenu
        id={id}
        className={className}
        items={[
          ...(jobs?.map(({ id, title }) => ({
            label: title,
            value: id,
          })) || []),
          { label: '', value: '', isDivider: true },
          {
            label: 'Create new job',
            value: 'CREATE',
            icon: {
              icon: 'plus',
            },
          },
        ]}
        trigger={{
          children: 'Invite to job',
          loading: jobsLoading || inviting,
          rightIcon: {
            icon: 'chevron-down',
          },
        }}
        onSelect={(value) => {
          if (value === 'CREATE') {
            setShowCreate(true)
          } else {
            onInvite(value)
          }
        }}
      />
      <JobForm
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={(next) => onInvite(next, true)}
      />
    </>
  )
}
export default InviteButton
