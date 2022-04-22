import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import Alert from 'components/common/Alert'
import Tabs from 'components/common/Tabs'

import cn from 'util/classnames'
import { useAppSelector } from 'util/store'

import AvailabilityForm from 'components/forms/profile/Availability'
import ProfileBasicForm from 'components/forms/profile/Basic'
import ProfileClientForm from 'components/forms/profile/Client'
import ProfileCoachForm from 'components/forms/profile/Coach'
import withAuth from 'components/hoc/withAuth'
import PageLayout from 'components/layouts/Page'

const EditProfilePage: NextPage = () => {
  const router = useRouter()
  const { profile } = useAppSelector((state) => state.profile)
  const [tab, setTab] = useState<number>(0)

  useEffect(() => {
    switch (router.query.tab as string) {
      case '1':
        setTab(1)
        break
      case '2':
        setTab(2)
        break
      case '3':
        setTab(3)
        break
      default:
        setTab(0)
        break
    }
  }, [router])

  return (
    <PageLayout title="Edit profile">
      <h1>Edit profile</h1>
      <Tabs
        className={cn('mt-2', { 'mb-2': tab !== 2 })}
        items={['General', 'Client', 'Coach', 'Coaching availability']}
        value={tab}
        onValueChange={(next) => {
          setTab(next)
          router.push({
            query: {
              ...router.query,
              tab: next,
            },
          })
        }}
      />
      {profile && (
        <>
          {tab === 0 ? (
            <ProfileBasicForm profile={profile} />
          ) : tab === 1 ? (
            <>
              {!profile.client && (
                <Alert
                  type="info"
                  title="No client profile"
                  description={
                    <p>
                      You don&apos;t have a client profile yet, create one now!
                    </p>
                  }
                />
              )}
              <ProfileClientForm
                profileId={profile.id}
                client={profile.client || undefined}
              />
            </>
          ) : tab === 2 ? (
            <>
              {!profile.coach ? (
                <Alert
                  className="my-2"
                  type="info"
                  title="No coach profile"
                  description={
                    <p>
                      You don&apos;t have a coach profile yet, apply to be a
                      coach now!
                    </p>
                  }
                />
              ) : !profile.coach.decision ? (
                <Alert
                  className="my-2"
                  type="info"
                  title="Coach profile under review"
                  description="Currently reviewing your coach application"
                />
              ) : profile.coach.decision === 'rejected' ? (
                <Alert
                  className="my-2"
                  type="info"
                  title="Coach application rejected"
                  description="Unfortunately, our team has decided to not move forward with your application. You are welcome to update your profile and reapply in the future."
                />
              ) : null}
              <ProfileCoachForm
                profileId={profile.id}
                coach={profile.coach || undefined}
              />
            </>
          ) : (
            <AvailabilityForm profile={profile} />
          )}
        </>
      )}
    </PageLayout>
  )
}
export default withAuth(EditProfilePage, { profileType: 'any' })
