import { Spinner as ChakraSpinner } from '@chakra-ui/react'

import cn from 'util/classnames'

import { CommonProps } from 'types/common'

type LoaderProps = CommonProps & {
  type?: 'default' | 'text' | 'full'
  size?: 'xs' | 'sm' | 'md' | 'lg'
}
const Loader = ({
  id,
  className,
  type = 'default',
  size = 'md',
}: LoaderProps) => {
  return type === 'default' ? (
    <ChakraSpinner id={id} className={className} size={size} />
  ) : type === 'text' ? (
    <div id={id} className={cn('flex flex-row items-center', className)}>
      <Loader size={size} />
      <p className="ml-2 text-lg font-semibold">Loading...</p>
    </div>
  ) : (
    <div
      className={cn(
        'flex flex-col justify-center items-center w-full h-full',
        className,
      )}
    >
      <Loader type="text" size={size} />
    </div>
  )
}
export default Loader
