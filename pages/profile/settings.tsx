import { useRouter } from 'next/router'

import Icon from 'components/common/Icon'

import { SUPPORT_EMAIL } from 'util/constants'
import { useAppSelector } from 'util/store'

import withAuth from 'components/hoc/withAuth'
import PageLayout from 'components/layouts/Page'

const SettingsPage = () => {
  const {
    user: { user },
  } = useAppSelector((state) => state)
  const router = useRouter()
  const options: {
    label: string
    onClick: () => void
    hidden?: boolean
  }[] = [
    {
      label: 'Edit profile',
      onClick: () => router.push('/profile/edit'),
    },
    {
      label: 'Payment information',
      onClick: () => undefined,
    },
    {
      label: 'Booking history',
      onClick: () => undefined,
    },
    {
      label: 'Contact support',
      onClick: () => window.open(`mailto:${SUPPORT_EMAIL}`),
    },
    {
      label: 'Terms and Conditions',
      onClick: () => router.push('/legal/terms'),
    },
    {
      label: 'Privacy Policy',
      onClick: () => router.push('/legal/privacy'),
    },
  ]

  return (
    <PageLayout title="Settings" contentClassName="max-w-screen-md">
      <h1 className="font-light">Settings</h1>
      <ul className="my-8 w-full divide-y">
        {options
          .filter(({ hidden }) => !hidden)
          .map(({ label, onClick }, idx) => (
            <li
              key={idx}
              role="button"
              onClick={onClick}
              className="flex flex-row justify-between items-center py-4 px-6 w-full hover:bg-gray-50 cursor-pointer"
            >
              <span className="font-semibold">{label}</span>
              <Icon icon="chevron-right" />
            </li>
          ))}
      </ul>
      <p className="flex flex-col items-center text-sm">
        <span>Logged in as</span>
        <strong className="font-semibold">{user?.email}</strong>
      </p>
    </PageLayout>
  )
}
export default withAuth(SettingsPage, { profileType: 'any' })
