import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'

import Error from 'components/features/util/Error'
import SetPassword from 'components/forms/auth/SetPassword'
import PageLayout from 'components/layouts/Page'
import StatusLayout from 'components/layouts/Status'

const PasswordPage: NextPage = () => {
  const router = useRouter()
  const [mode, setMode] = useState<'initial' | 'success' | 'expired' | 'error'>(
    'initial',
  )

  const code = useMemo<string>(
    () => router.query.code as string,
    [router.query],
  )

  return (
    <PageLayout
      title="Reset password"
      contentClassName="flex flex-col items-center justify-center"
      isHeaderHidden={true}
      isPagePublic={true}
    >
      {mode === 'initial' ? (
        <SetPassword
          code={code}
          onSuccess={() => setMode('success')}
          onExpired={() => setMode('expired')}
        />
      ) : mode === 'success' ? (
        <StatusLayout
          title="New password set"
          description="You can now log in with your new password!"
          button={{
            href: '/auth',
            text: 'Back to login',
          }}
        />
      ) : mode === 'expired' ? (
        <StatusLayout
          title="Link expired"
          description="This link has expired, please request a new link to reset your password."
        />
      ) : (
        <Error />
      )}
    </PageLayout>
  )
}
export default PasswordPage
