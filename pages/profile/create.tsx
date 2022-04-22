import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import Button from 'components/common/Button'
import Carousel from 'components/common/Carousel'

import { APP_NAME } from 'util/constants'

import ProfileForm from 'components/forms/profile/Profile'
import withAuth from 'components/hoc/withAuth'
import PageLayout from 'components/layouts/Page'

const ProfilePage: NextPage = () => {
  const router = useRouter()
  const [view, setView] = useState<'initial' | 'form'>('initial')
  const [mode, setMode] = useState<'create' | 'edit'>('create')

  useEffect(() => {
    if (router.isReady && router.query.mode === 'edit') {
      setMode('edit')
      setView('form')
    }
  }, [router])

  return (
    <PageLayout
      contentClassName="flex flex-col items-center justify-center"
      title={mode === 'edit' ? 'Edit profile' : 'Create profile'}
      isHeaderHidden={true}
      isPagePublic={true}
    >
      <div className="max-w-200 text-center">
        {view === 'initial' ? (
          <div className="max-w-100">
            <h1>Personalized setup</h1>
            <p className="mt-4">
              Take some time to setup your {APP_NAME} account and we&apos;ll
              give you recommendations to get you started on accomplishing your
              personal health goals
            </p>
            <Carousel
              className="my-5 h-60"
              showControls={false}
              items={[
                {
                  content: (
                    <div className="flex flex-row justify-center items-center">
                      <div className="w-50 h-50 bg-gray-400 rounded"></div>
                    </div>
                  ),
                },
                {
                  content: (
                    <div className="flex flex-row justify-center items-center">
                      <div className="w-50 h-50 bg-gray-400 rounded-full"></div>
                    </div>
                  ),
                },
              ]}
            />
            <Button className="!px-20" onClick={() => setView('form')}>
              Get started
            </Button>
          </div>
        ) : (
          <ProfileForm
            mode={mode}
            type={router.query.type === 'coach' ? 'coach' : 'client'}
            onSubmit={(type) => {
              if (type === 'client') {
                router.push('/client/home')
              } else {
                router.push('/coach/review')
              }
            }}
            onCancel={() => {
              if (router.query.type === 'coach') {
                router.push('/client/home')
              } else {
                router.push('/coach/review')
              }
            }}
          />
        )}
      </div>
    </PageLayout>
  )
}
export default withAuth(ProfilePage, { checkProfile: false })
