import { useMemo } from 'react'

import { CommonProps } from 'types/common'

type NumPreviousClientsProps = CommonProps & {
  value: number
}
const NumPreviousClients = ({
  id,
  className,
  value,
}: NumPreviousClientsProps) => {
  const str = useMemo(() => {
    switch (value) {
      case 0:
        return '0 - 5'
      case 5:
        return '5 - 10'
      case 10:
        return 'More than 10'
      default:
        return 'N/A'
    }
  }, [value])

  return (
    <p id={id} className={className}>
      {str}
    </p>
  )
}
export default NumPreviousClients
