import { NextPage } from 'next'
import { useMemo } from 'react'

import dayjs from 'dayjs'

import Button from 'components/common/Button'
import Table from 'components/common/Table'

import NumPreviousClients from 'components/features/profile/NumPreviousClients'
import TagsList from 'components/features/util/TagsList'
import withAuth from 'components/hoc/withAuth'
import PageLayout from 'components/layouts/Page'
import { adminApi } from 'services/admin'

const Coaches: NextPage = () => {
  const {
    data: coaches,
    isError,
    isLoading,
  } = adminApi.useGetCoachesUnderReviewQuery(undefined)

  const profilesList = useMemo(
    () =>
      coaches?.map(({ id, firstName, lastName, coach }) => ({
        id,
        firstName,
        lastName,
        tags: coach?.tags || [],
        previousClients: coach?.numPreviousClients || 0,
        submitted: coach?.createdTime || 0,
      })) || [],
    [coaches],
  )

  return (
    <PageLayout title="Coaches" error={isError} loading={isLoading}>
      <h1>Pending coaches</h1>
      <p className="font-light">
        Note, only the oldest 100 profile submissions will be shown
      </p>
      {profilesList.length > 0 ? (
        <Table
          className="mt-4"
          data={profilesList}
          columns={[
            {
              Header: 'First name',
              accessor: 'firstName',
            },
            {
              Header: 'Last name',
              accessor: 'lastName',
            },
            {
              Header: 'Tags',
              accessor: 'tags',
              Cell: ({ value }: { value: string[] }) => (
                <TagsList className="justify-end py-2 w-full" tags={value} />
              ),
              minWidth: 210,
            },
            {
              Header: 'Previous clients',
              accessor: 'previousClients',
              Cell: ({ value }: { value: number }) => (
                <NumPreviousClients value={value} />
              ),
            },
            {
              Header: 'Submitted time',
              accessor: 'submitted',
              Cell: ({ value }: { value: number }) =>
                dayjs(value).format('MMM DD, YYYY - h:mm A'),
            },
            {
              Header: '',
              accessor: 'id',
              disableSortBy: true,
              Cell: ({ value }: { value: string }) => (
                <Button
                  leftIcon={{ icon: 'eye' }}
                  variant="outlined"
                  size="sm"
                  href={`/admin/coach/${value}`}
                >
                  View
                </Button>
              ),
            },
          ]}
          defaultSort={{
            id: 'submitted',
            desc: false,
          }}
        />
      ) : (
        <p className="mt-4 text-lg text-center">
          No coach profiles waiting for review
        </p>
      )}
    </PageLayout>
  )
}
export default withAuth(Coaches, {
  checkProfile: false,
})
