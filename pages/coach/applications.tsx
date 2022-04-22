import { NextPage } from 'next'
import { useState } from 'react'

import Tabs from 'components/common/Tabs'

import ApplicationsList from 'components/features/job/ApplicationsList'
import withAuth from 'components/hoc/withAuth'
import PageLayout from 'components/layouts/Page'

const ApplicationsPage: NextPage = () => {
  const [tab, setTab] = useState<number>(0)

  return (
    <PageLayout title="Applications" contentClassName="flex flex-col gap-y-4">
      <h1>Your applications</h1>
      <Tabs
        items={['Under consideration', 'Past applications']}
        value={tab}
        onValueChange={setTab}
      />
      <ApplicationsList
        mode={tab === 0 ? 'open' : 'archive'}
        emptyMessage={
          tab === 0
            ? 'No open applications, find jobs in the explore page!'
            : 'No archived applications yet'
        }
      />
    </PageLayout>
  )
}
export default withAuth(ApplicationsPage, { profileType: 'coach' })
