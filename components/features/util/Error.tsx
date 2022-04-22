import Alert from 'components/common/Alert'

import { GENERIC_ERROR } from 'util/constants'

import { CommonProps } from 'types/common'

import StatusLayout from 'components/layouts/Status'

type ErrorProps = CommonProps

export const ErrorAlert = ({ id, className }: ErrorProps) => (
  <Alert
    id={id}
    className={className}
    type="error"
    title="Unexpected problem"
    description={GENERIC_ERROR}
  />
)

const Error = ({ id, className }: ErrorProps) => {
  return (
    <StatusLayout
      id={id}
      className={className}
      title="Unexpected error"
      description="Uh oh, we encountered an unexpected problem. Please try again later."
    />
  )
}
export default Error
