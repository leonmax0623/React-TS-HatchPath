import { useState } from 'react'

import Tabs from 'components/common/Tabs'

import JobListByOwner from 'components/features/job/ListByOwner'
import withAuth from 'components/hoc/withAuth'
import PageLayout from 'components/layouts/Page'

const JobPage = () => {
  const [tab, setTab] = useState<number>(0)
  return (
    <PageLayout title="Jobs">
      <h1>Your jobs</h1>
      <Tabs
        className="my-2"
        items={['Active jobs', 'Past jobs']}
        value={tab}
        onValueChange={setTab}
      />
      <JobListByOwner
        mode={tab === 0 ? 'open' : 'archive'}
        emptyMessage={
          tab === 0 ? 'No open jobs, create one now!' : 'No archived jobs yet'
        }
      />
    </PageLayout>
  )
}
export default withAuth(JobPage, { profileType: 'client' })
