import Loader from 'components/common/Loader'

import cn from 'util/classnames'

import { CommonProps } from 'types/common'

import { profilesApi } from 'services/profiles'

import ProfileCard from './Card'

type ProfileSearchProps = CommonProps & {
  search: string
}
const ProfileSearch = ({ id, className, search }: ProfileSearchProps) => {
  const { data: profiles, isLoading } =
    profilesApi.useSearchCoachesQuery(search)

  return (
    <div id={id} className={cn('flex flex-col gap-y-2', className)}>
      {isLoading && <Loader className="mx-auto" />}
      {profiles?.length ? (
        <ul className="grid grid-cols-12 gap-4">
          {profiles?.map((profile, idx) => (
            <li key={idx} className="col-span-12 md:col-span-4">
              <ProfileCard profile={profile} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-lg">No profiles match your search</p>
      )}
    </div>
  )
}
export default ProfileSearch
