import cn from 'util/classnames'

import { CommonProps } from 'types/common'
import { ProfileType } from 'types/profile'

import ProfileCard from './Card'

type ProfileListProps = CommonProps & {
  profiles: ProfileType[]
}
const ProfileList = ({ id, className, profiles }: ProfileListProps) => {
  return (
    <ul id={id} className={cn('grid grid-cols-12 gap-4', className)}>
      {profiles?.map((profile, idx) => (
        <li key={idx} className="col-span-12 md:col-span-4">
          <ProfileCard profile={profile} />
        </li>
      ))}
    </ul>
  )
}
export default ProfileList
