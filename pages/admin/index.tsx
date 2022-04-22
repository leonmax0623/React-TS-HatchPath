import { NextPage } from 'next'
import { useRouter } from 'next/router'

import AdminLoginForm from 'components/forms/auth/AdminLogin'
import Page from 'components/layouts/Page'

const AdminLandingPage: NextPage = () => {
  const router = useRouter()

  return (
    <Page
      title="Login"
      isHeaderHidden={true}
      contentClassName="flex flex-col items-center justify-center"
    >
      <div className="flex flex-col items-center w-full md:w-100">
        <h1 className="text-center">Login here</h1>
        <AdminLoginForm
          className="mt-2 w-full"
          onLogin={() => {
            router.push('/admin/waitlist')
          }}
        />
      </div>
    </Page>
  )
}
export default AdminLandingPage
