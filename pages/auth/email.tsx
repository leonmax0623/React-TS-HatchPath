import { NextPage } from 'next'
import { useCallback, useEffect, useState } from 'react'

import Button from 'components/common/Button'

import { APP_NAME } from 'util/constants'
import { useAppDispatch, useAppSelector } from 'util/store'

import { sendEmailVerify } from 'slices/user'

import withAuth from 'components/hoc/withAuth'
import PageLayout from 'components/layouts/Page'

const EmailPage: NextPage = () => {
  const { user } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()

  const [initialSent, setInitialSent] = useState<boolean>(false)
  const [sending, setSending] = useState<boolean>(false)

  const onSend = useCallback(async () => {
    setSending(true)
    await dispatch(sendEmailVerify())
    setSending(false)
  }, [dispatch])

  useEffect(() => {
    if (!initialSent) {
      onSend()
      setInitialSent(true)
    }
  }, [initialSent, onSend])

  return (
    <PageLayout
      contentClassName="flex flex-col items-center justify-center"
      isHeaderHidden={true}
      isPagePublic={true}
    >
      <div className="flex flex-col max-w-120 text-center">
        <h1>Verify your email</h1>
        <p className="mt-4">
          Before you get access to {APP_NAME}, we need to verify your email.
          Instructions have been sent to <strong>{user?.email}</strong>. After
          you are done, you can click the button below to continue.
        </p>
        <Button className="mt-10" href="/auth?mode=login">
          Verified your email
        </Button>
        <Button
          className="mt-2"
          variant="text"
          size="sm"
          onClick={onSend}
          loading={sending}
        >
          Resend instructions
        </Button>
      </div>
    </PageLayout>
  )
}
export default withAuth(EmailPage, { checkProfile: false })
