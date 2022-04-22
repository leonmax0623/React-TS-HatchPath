import Image from 'next/image'

import Button from 'components/common/Button'

import cn from 'util/classnames'

import { CommonProps } from 'types/common'
import { ProfileType } from 'types/profile'

type ProfileOverviewProps = CommonProps & {
  descriptionClassName?: string
  profile: ProfileType
  type: 'coach' | 'client'
}
const ProfileOverview = ({
  id,
  className,
  descriptionClassName,
  profile,
  type,
}: ProfileOverviewProps) => {
  return (
    <div id={id} className={className}>
      <div className="flex flex-row items-center">
        {profile.profileImage?.url && (
          <div className="flex flex-col justify-center items-center mr-2">
            <Image
              className="rounded-full"
              src={profile.profileImage?.url}
              alt="profile"
              height={50}
              width={50}
            />
          </div>
        )}
        <p className="text-xl font-semibold">
          {profile.firstName} {profile.lastName}
          {type === 'coach' && profile.coach?.businessName && (
            <span className="block text-sm font-light">
              {profile.coach?.businessName}
            </span>
          )}
        </p>
        <Button
          className="ml-auto"
          href={`/profile/${profile?.id}`}
          target="_blank"
          variant="link"
          leftIcon={{
            icon: 'external-link',
          }}
        >
          Visit {type === 'client' ? 'client' : 'coach'} profile
        </Button>
      </div>
      <p className={cn('mt-2 line-clamp-3', descriptionClassName)}>
        {type === 'client'
          ? profile.client?.description
          : profile.coach?.description}
      </p>
    </div>
  )
}
export default ProfileOverview
