import {
  Tag as ChakraTag,
  TagLabel as ChakraTagLabel,
  TagCloseButton as ChakraCloseButton,
} from '@chakra-ui/react'

import { CommonProps } from 'types/common'

export type TagSizeType = 'sm' | 'md' | 'lg'
type TagProps = CommonProps & {
  label?: string
  labelClassName?: string
  size?: TagSizeType
  showClose?: boolean
  onClose?: () => void
}
const Tag = ({
  id,
  className,
  labelClassName,
  label,
  size,
  showClose = false,
  onClose = () => undefined,
}: TagProps): JSX.Element => {
  return (
    <ChakraTag id={id} className={className} size={size}>
      <ChakraTagLabel className={labelClassName}>{label}</ChakraTagLabel>
      {showClose && <ChakraCloseButton onClick={onClose} />}
    </ChakraTag>
  )
}
export default Tag
