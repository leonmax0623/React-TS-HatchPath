import Image from 'next/image'
import Link from 'next/link'

import Icon from 'components/common/Icon'

import cn from 'util/classnames'

import { CommonProps } from 'types/common'
import { ProfileType } from 'types/profile'

type ProfileCardProps = CommonProps & {
  profile: ProfileType
}
const ProfileCard = ({ id, className, profile }: ProfileCardProps) => {
  return (
    <div id={id} className={cn('rounded cursor-pointer', className)}>
      <Link href={`/profile/${profile.id}`} passHref={true}>
        <a className="flex flex-col w-full h-full">
          <div className="flex relative flex-col justify-center items-center w-full h-50 bg-gray-500 rounded">
            {profile.profileImage && profile.profileImage.url ? (
              <Image
                src={profile.profileImage.url}
                alt="program banner"
                layout="fill"
                objectFit="contain"
              />
            ) : (
              <Icon icon="image-slash" className="!w-10 !h-10 text-white" />
            )}
          </div>
          <h3>
            {profile.firstName} {profile.lastName}
          </h3>
          {profile.coach?.businessName && <p>{profile.coach?.businessName}</p>}
        </a>
      </Link>
    </div>
  )
}
export default ProfileCard
