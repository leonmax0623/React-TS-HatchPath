import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import dayjs from 'dayjs'

import Alert from 'components/common/Alert'
import Button from 'components/common/Button'
import Icon from 'components/common/Icon'
import InputText from 'components/common/InputText'
import PopoverMenu from 'components/common/PopoverMenu'
import { useToast } from 'components/common/Toast'
import Tooltip from 'components/common/Tooltip'

import { keyBy } from 'util/list'
import { equalsIgnoreCase, usdFormat } from 'util/string'

import { ApplicationType } from 'types/job'
import { ProfileType } from 'types/profile'
import { ProgramType } from 'types/program'

import ApplicationPanel from 'components/features/job/ApplicationPanel'
import ConfirmModal from 'components/features/util/Confirm'
import JobForm from 'components/forms/Job'
import withAuth from 'components/hoc/withAuth'
import PageLayout from 'components/layouts/Page'
import { jobsApi } from 'services/job'
import { profilesApi } from 'services/profiles'
import { programsApi } from 'services/program'

const ManagePage: NextPage = () => {
  const router = useRouter()
  const { toast, error } = useToast()

  const {
    data: job,
    isLoading,
    isError,
  } = jobsApi.useGetJobQuery(router.query.jobId as string)
  const [getProgramsById] = programsApi.useLazyGetProgramsByIdQuery()
  const [getProfilesById] = profilesApi.useLazyGetProfilesByIdQuery()
  const [removeJob] = jobsApi.useRemoveJobMutation()

  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [viewing, setViewing] = useState<
    | {
        applicationId: string
        programId: string
        profileId: string
      }
    | undefined
  >(undefined)

  const [programs, setPrograms] = useState<
    Record<string, ProgramType> | undefined
  >(undefined)
  const [profiles, setProfiles] = useState<
    Record<string, ProfileType> | undefined
  >(undefined)
  const [search, setSearch] = useState<string>('')
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false)

  useEffect(() => {
    if (
      !viewing &&
      router.query.applicationId &&
      router.query.programId &&
      router.query.profileId &&
      programs &&
      profiles &&
      job
    ) {
      const applicationId = router.query.applicationId as string
      const programId = router.query.programId as string
      const profileId = router.query.profileId as string
      if (
        programs[programId] &&
        profiles[profileId] &&
        job.applications[applicationId]
      ) {
        setViewing({
          applicationId,
          programId,
          profileId,
        })
      }
    }
  }, [router, viewing, programs, profiles, job])

  const applications = useMemo<ApplicationType[] | undefined>(
    () =>
      job?.applications
        ? Object.values(job.applications).filter(({ program, coach }) => {
            if (
              search &&
              programs &&
              profiles &&
              programs[program] &&
              profiles[coach]
            ) {
              return (
                equalsIgnoreCase(programs[program].title, search, true) ||
                equalsIgnoreCase(
                  `${profiles[coach].firstName} ${profiles[coach].lastName}`,
                  search,
                  true,
                ) ||
                (profiles[coach].coach?.businessName &&
                  equalsIgnoreCase(
                    profiles[coach].coach?.businessName,
                    search,
                    true,
                  ))
              )
            } else {
              return true
            }
          })
        : undefined,
    [job, profiles, programs, search],
  )

  useEffect(() => {
    if (job?.applications) {
      const programIds = Object.values(job.applications || {}).map(
        ({ program }) => program,
      )
      const profileIds = Object.values(job.applications || {}).map(
        ({ coach }) => coach,
      )

      getProgramsById(programIds)
        .unwrap()
        .then((programList) => {
          setPrograms(keyBy(programList, 'id'))
        })
      getProfilesById(profileIds)
        .unwrap()
        .then((profileList) => {
          setProfiles(keyBy(profileList, 'id'))
        })
    }
  }, [getProgramsById, getProfilesById, job])

  return (
    <PageLayout
      title={job?.title}
      loading={isLoading}
      error={isError}
      notFound={!job}
    >
      <div className="flex flex-row justify-between items-center">
        <h1>
          <span className="block text-lg font-light text-gray-500">
            Manage your job
          </span>
          <span>{job?.title}</span>
        </h1>
        <div className="flex flex-row gap-x-3 items-center">
          <Button
            variant="link"
            leftIcon={{ icon: 'external-link' }}
            href={`/job/${job?.id}`}
            target="_blank"
          >
            View job
          </Button>
          <Button onClick={() => setOpenEdit(true)}>Edit job</Button>
          <PopoverMenu
            items={[{ label: 'Delete job', value: 'delete' }]}
            trigger={{
              children: <Icon icon="ellipsis-v" />,
              variant: 'text',
            }}
            onSelect={(value) => {
              if (value === 'delete') {
                setShowConfirmDelete(true)
              }
            }}
          />
        </div>
      </div>
      {job?.accepted ? (
        <Alert
          className="mt-2"
          title="Job is closed"
          description={
            <p>
              An application has been accepted for this job. Click
              <Link href={`/enrollment/${job.accepted.enrollment}`} passHref>
                <Button variant="link">here</Button>
              </Link>
              for more details
            </p>
          }
          type="warning"
        />
      ) : !job?.isOpen ? (
        <Alert
          className="mt-2"
          title="Job is not open"
          description={
            <p>
              Note that this job is currently not accepting applications from
              coaches.
            </p>
          }
          type="warning"
        />
      ) : null}
      <div className="my-2">
        <InputText
          className="w-full"
          placeholder="Search applications"
          leftIcon={{ icon: 'magnifying-glass' }}
          value={search}
          onValueChange={setSearch}
        />
      </div>
      {applications && applications.length > 0 && programs && profiles ? (
        <div className="mt-6">
          <ul className="grid grid-cols-12 gap-4 mt-4">
            {applications.map(
              ({ id, program, coach, createdTime, price }, idx) => (
                <li
                  key={idx}
                  className="col-span-12 p-4 active:bg-gray-50 rounded border border-gray-200 hover:shadow cursor-pointer md:col-span-4"
                  role="button"
                  onClick={() => {
                    if (profiles[coach] && programs[program]) {
                      router.push({
                        query: {
                          ...router.query,
                          applicationId: id,
                          programId: program,
                          profileId: coach,
                        },
                      })
                      setViewing({
                        applicationId: id,
                        programId: program,
                        profileId: coach,
                      })
                    }
                  }}
                >
                  <div className="flex flex-row justify-between items-center">
                    <h2>
                      {profiles[coach]?.firstName} {profiles[coach]?.lastName}
                      {profiles[coach]?.coach?.businessName && (
                        <span className="block text-sm font-light">
                          {profiles[coach]?.coach?.businessName}
                        </span>
                      )}
                    </h2>
                    {job?.isOpen && job?.unreadCoachMessage.length > 0 && (
                      <Tooltip
                        label="Unread messages from coach"
                        wrapTrigger={true}
                      >
                        <Icon icon="envelope" />
                      </Tooltip>
                    )}
                  </div>

                  <p className="flex flex-row items-center mt-2">
                    <span>{programs[program]?.title}</span>
                    <span className="pl-2 ml-2 border-l border-gray-300">
                      {usdFormat.format(price)}
                    </span>
                  </p>
                  <p className="mt-2 text-gray-600">
                    Submitted {dayjs(createdTime).format('MMM DD, YYYY')}
                  </p>
                </li>
              ),
            )}
          </ul>
        </div>
      ) : (
        <p className="mt-6 text-lg font-light text-center text-gray-400">
          {search
            ? 'No applications match your search'
            : 'No applications yet, check back later!'}
        </p>
      )}

      {job && programs && profiles && (
        <ApplicationPanel
          open={!!viewing}
          onClose={() => {
            const query = router.query
            delete query['applicationId']
            delete query['programId']
            delete query['profileId']
            delete query['tab']

            router.push({
              query,
            })
            setViewing(undefined)
          }}
          job={job}
          program={viewing ? programs[viewing.programId] : undefined}
          coach={viewing ? profiles[viewing.profileId] : undefined}
          application={
            viewing ? job.applications[viewing.applicationId] : undefined
          }
        />
      )}
      <JobForm
        job={job}
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onSubmit={() => setOpenEdit(false)}
      />
      <ConfirmModal
        open={showConfirmDelete}
        title="Delete job"
        message="Are you sure you want to delete this job? All applications will be lost."
        confirmProps={{
          color: 'error',
        }}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={async () => {
          if (job) {
            try {
              await removeJob(job.id)
              toast({
                title: 'Job deleted',
                description: 'Succesfully deleted the job',
                type: 'success',
              })
              setShowConfirmDelete(false)
              router.push('/client/home')
            } catch {
              error()
            }
          }
        }}
      />
    </PageLayout>
  )
}
export default withAuth(ManagePage, { profileType: 'client' })
