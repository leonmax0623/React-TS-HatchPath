import type { NextPage } from 'next'

import PageLayout from 'components/layouts/Page'

const NotFoundPage: NextPage = () => {
  return (
    <PageLayout
      title="Page not found"
      contentClassName="flex flex-col items-center justify-center"
      isHeaderHidden={true}
      isPagePublic={true}
    >
      <h1>404: Page not found</h1>
    </PageLayout>
  )
}

export default NotFoundPage
