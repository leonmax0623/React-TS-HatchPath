import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'

import Button from 'components/common/Button'
import Tabs from 'components/common/Tabs'
import { useToast } from 'components/common/Toast'

import ProgramBannerForm from 'components/forms/program/Banner'
import ProgramBasicForm from 'components/forms/program/Basic'
import ProgramSessionsForm from 'components/forms/program/Sessions/Sessions'
import ProgramSettingsForm from 'components/forms/program/Settings'
import withAuth from 'components/hoc/withAuth'
import PageLayout from 'components/layouts/Page'
import { programsApi } from 'services/program'

const DashboardPage: NextPage = () => {
  const router = useRouter()
  const { toast, error } = useToast()
  const {
    data: program,
    isLoading,
    isError,
  } = programsApi.useGetProgramQuery(router.query.programId as string)
  const [removeProgram, { isLoading: removing }] =
    programsApi.useRemoveProgramMutation()
  const [tab, setTab] = useState<number>(0)

  const onRemove = async () => {
    if (program) {
      try {
        await removeProgram(program.id).unwrap()
        toast({
          title: 'Program deleted',
          description: 'Succesfully deleted this program',
          type: 'success',
        })
        router.push('/coach/home')
      } catch {
        error()
      }
    }
  }

  return (
    <PageLayout
      title={program?.title}
      loading={isLoading}
      error={isError}
      notFound={!program}
    >
      <div className="flex flex-row justify-between items-center">
        <h1>Manage your program</h1>
        <Button
          href={`/program/${program?.id}`}
          variant="link"
          leftIcon={{ icon: 'external-link' }}
          target="_blank"
        >
          View program
        </Button>
      </div>
      <Tabs
        className="my-4"
        items={['Basic info', 'Banner image', 'Sessions', 'Settings']}
        value={tab}
        onValueChange={setTab}
      />
      {program && (
        <>
          {tab === 0 ? (
            <ProgramBasicForm program={program} />
          ) : tab === 1 ? (
            <ProgramBannerForm program={program} />
          ) : tab === 2 ? (
            <ProgramSessionsForm program={program} />
          ) : (
            <>
              <ProgramSettingsForm program={program} />
              <div className="flex flex-col items-center mt-6">
                <Button
                  className="mx-auto"
                  size="sm"
                  variant="text"
                  color="error"
                  loading={removing}
                  onClick={onRemove}
                >
                  Delete program
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </PageLayout>
  )
}
export default withAuth(DashboardPage, {
  profileType: 'coach',
})
