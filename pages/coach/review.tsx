import { NextPage } from 'next'

import Button from 'components/common/Button'

import { APP_NAME } from 'util/constants'
import { useAppSelector } from 'util/store'

import withAuth from 'components/hoc/withAuth'
import PageLayout from 'components/layouts/Page'

const ReviewPage: NextPage = () => {
  const { profile } = useAppSelector((state) => state.profile)
  return (
    <PageLayout contentClassName="flex flex-col items-center justify-center">
      <div className="max-w-130 text-center">
        {profile?.coach?.decision === 'rejected' ? (
          <>
            <h1>Your application has been denied</h1>
            <p className="mt-8 text-lg">
              Your application is not a good fit for {APP_NAME} currently. Feel
              free to update your profile and resubmit an application for
              review.
            </p>
            <Button className="mx-auto mt-4" href="/profile/edit?tab=2">
              Update your profile
            </Button>
          </>
        ) : (
          <>
            <h1>Your coach application is under review</h1>
            <p className="mt-8 text-lg">
              Our team is reviewing your application to be a coach on {APP_NAME}
              . We will get back to you as soon as we can!
            </p>
          </>
        )}
      </div>
    </PageLayout>
  )
}
export default withAuth(ReviewPage, {
  profileType: 'coach',
  checkIsCoachApproved: false,
})
