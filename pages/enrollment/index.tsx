import { NextPage } from 'next'
import { useState } from 'react'

import Tabs from 'components/common/Tabs'

import { useAppSelector } from 'util/store'

import EnrollmentListByOwner from 'components/features/enrollment/ListByOwner'
import withAuth from 'components/hoc/withAuth'
import PageLayout from 'components/layouts/Page'

const EnrollmentPage: NextPage = () => {
  const { profile } = useAppSelector((state) => state.profile)
  const [tab, setTab] = useState<number>(0)

  return (
    <PageLayout title="Enrollments">
      <h1>Enrollments</h1>
      <Tabs
        className="my-2"
        items={['Active', 'Completed']}
        value={tab}
        onValueChange={setTab}
      />
      {profile && (
        <EnrollmentListByOwner
          userId={profile.id}
          mode={tab === 0 ? 'active' : 'archive'}
          type={profile.mode}
        />
      )}
    </PageLayout>
  )
}
export default withAuth(EnrollmentPage, { profileType: 'any' })
