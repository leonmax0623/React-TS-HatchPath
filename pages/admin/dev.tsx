import { NextPage } from 'next'

import Alert from 'components/common/Alert'
import Button from 'components/common/Button'
import { useToast } from 'components/common/Toast'

import { isDev, isRemote } from 'util/env'

import withAuth from 'components/hoc/withAuth'
import PageLayout from 'components/layouts/Page'
import { adminApi } from 'services/admin'

const DevPage: NextPage = () => {
  const { toast, error } = useToast()
  const [addData, { isLoading: adding }] = adminApi.useAddDataMutation()
  const [wipeData, { isLoading: wiping }] = adminApi.useWipeDataMutation()

  const onAddData = async () => {
    if (isDev && !isRemote) {
      try {
        await addData().unwrap()
        toast({
          title: 'Data added',
          description: 'Mock data added',
          type: 'success',
        })
      } catch (err) {
        error()
      }
    }
  }

  const onWipeData = async () => {
    if (isDev && !isRemote) {
      try {
        await wipeData().unwrap()
        toast({
          title: 'Data wiped',
          description: 'Wiped all data',
          type: 'success',
        })
      } catch (err) {
        error()
      }
    }
  }

  return (
    <PageLayout title="Dev">
      <h1>Dev tools</h1>
      <Alert
        title="Hey you!"
        description="Make sure this is running locally and not in remote mode"
        type="warning"
      />
      <div className="flex flex-col gap-y-4 mt-8">
        <Button loading={adding} onClick={onAddData}>
          Add mock data
        </Button>
        <Button loading={wiping} onClick={onWipeData}>
          Wipe data
        </Button>
      </div>
    </PageLayout>
  )
}
export default withAuth(DevPage, { checkProfile: false })
