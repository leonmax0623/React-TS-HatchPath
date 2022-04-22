import { NextPage } from 'next'

import dayjs from 'dayjs'

import Button from 'components/common/Button'
import Table from 'components/common/Table'
import { useToast } from 'components/common/Toast'

import TagsList from 'components/features/util/TagsList'
import withAuth from 'components/hoc/withAuth'
import PageLayout from 'components/layouts/Page'
import { adminApi } from 'services/admin'

const WaitlistPage: NextPage = () => {
  const { toast, error } = useToast()
  const { data: waitlist, isLoading, isError } = adminApi.useGetWaitlistQuery()
  const [downloadWaitlist, { isLoading: downloading }] =
    adminApi.useDownloadWaitlistMutation()

  const onDownload = async () => {
    try {
      await downloadWaitlist().unwrap()
      toast({
        title: 'CSV Downloaded',
        description: 'Succesfully downloaded CSV of waitlist data',
        type: 'success',
      })
    } catch (err) {
      error()
    }
  }

  return (
    <PageLayout title="Waitlist" loading={isLoading} error={isError}>
      <div className="flex flex-row justify-between items-center">
        <h1>Waitlist</h1>
        <Button onClick={onDownload} loading={downloading}>
          Export CSV
        </Button>
      </div>
      <p className="font-light">
        Note, only the latest 100 waitlist submissions will be shown here.
        Export to CSV in order to see the full waitlist
      </p>
      {waitlist?.length ? (
        <Table
          className="mt-4"
          data={waitlist}
          columns={[
            {
              Header: 'Name',
              accessor: 'name',
            },
            {
              Header: 'Email',
              accessor: 'email',
            },
            {
              Header: 'City',
              accessor: 'city',
            },
            {
              Header: 'Tags',
              accessor: 'tags',
              Cell: ({ value }: { value: string[] }) => (
                <TagsList className="justify-end py-2 w-full" tags={value} />
              ),
              minWidth: 200,
            },
            {
              Header: 'Registered time',
              accessor: 'createdTime',
              Cell: ({ value }: { value: number }) =>
                dayjs(value).format('MMM DD, YYYY hh:mm A'),
            },
            {
              Header: 'Type',
              accessor: 'type',
            },
          ]}
          defaultSort={{
            id: 'createdTime',
            desc: true,
          }}
        />
      ) : (
        <p className="mt-4 text-lg text-center">Waitlist is currently empty</p>
      )}
    </PageLayout>
  )
}
export default withAuth(WaitlistPage, {
  checkProfile: false,
})
