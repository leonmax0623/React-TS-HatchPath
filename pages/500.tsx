import type { NextPage } from 'next'

import PageLayout from 'components/layouts/Page'

const ErrorPage: NextPage = () => {
  return (
    <PageLayout
      contentClassName="flex flex-col items-center justify-center"
      isHeaderHidden={true}
      isPagePublic={true}
    >
      <h1>500: Unexpected error</h1>
    </PageLayout>
  )
}

export default ErrorPage
