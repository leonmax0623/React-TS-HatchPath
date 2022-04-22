import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import Loader from 'components/common/Loader'

import { APP_NAME } from 'util/constants'
import { useAppDispatch } from 'util/store'

import { verifyEmail } from 'slices/user'

import Error from 'components/features/util/Error'
import PageLayout from 'components/layouts/Page'
import StatusLayout from 'components/layouts/Status'

const VerifyPage = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [mode, setMode] = useState<'loading' | 'success' | 'expired' | 'error'>(
    'loading',
  )

  const code = useMemo<string>(
    () => router.query.code as string,
    [router.query],
  )

  useEffect(() => {
    if (mode === 'loading' && router.isReady) {
      if (code) {
        dispatch(verifyEmail(code)).then((response) => {
          if (verifyEmail.fulfilled.match(response)) {
            setMode('success')
          } else {
            if (response.payload === 'EXPIRED') {
              setMode('expired')
            } else {
              setMode('error')
            }
          }
        })
      } else {
        setMode('expired')
      }
    }
  }, [mode, code, dispatch, router])

  return (
    <PageLayout
      contentClassName="flex flex-col items-center justify-center"
      title="Verify email"
      isHeaderHidden={true}
      isPagePublic={true}
    >
      {mode === 'loading' ? (
        <Loader type="full" />
      ) : mode === 'success' ? (
        <StatusLayout
          title="Email verified!"
          description={`Thanks for verifying your email. You now have full access to ${APP_NAME}!`}
          button={{
            href: '/auth?mode=login',
            text: 'Back to login',
          }}
        />
      ) : mode === 'expired' ? (
        <StatusLayout
          title="Link expired"
          description="This link has expired, please request a new link to verify your email."
        />
      ) : (
        <Error />
      )}
    </PageLayout>
  )
}
export default VerifyPage
