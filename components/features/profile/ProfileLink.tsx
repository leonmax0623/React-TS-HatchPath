import { useMemo } from 'react'

import Button from 'components/common/Button'
import { IconProps, IconName } from 'components/common/Icon'

import { equalsIgnoreCase } from 'util/string'

import { CommonProps } from 'types/common'

const urlToIcon = (url: string): IconProps => {
  const obj = new URL(url)
  const brands: { name: string; icon: IconName }[] = [
    {
      name: 'instagram',
      icon: 'instagram',
    },
    {
      name: 'facebook',
      icon: 'facebook',
    },
    {
      name: 'youtube',
      icon: 'youtube',
    },
    {
      name: 'tiktok',
      icon: 'tiktok',
    },
  ]
  for (const brand of brands) {
    if (equalsIgnoreCase(obj.hostname, brand.name, true)) {
      return {
        icon: brand.icon,
        variant: 'brand',
        className: '!w-4 !h-4',
      }
    }
  }
  return {
    icon: 'link',
  }
}

type ProfileLink = CommonProps & {
  url: string
}
const ProfileLink = ({ id, className, url }: ProfileLink) => {
  const icon = useMemo<IconProps>(() => urlToIcon(url), [url])

  return (
    <Button
      id={id}
      className={className}
      leftIcon={icon}
      variant="link"
      href={url}
      target="_blank"
    >
      {url}
    </Button>
  )
}
export default ProfileLink
