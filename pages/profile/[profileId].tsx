import { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import Icon from 'components/common/Icon'
import Tabs from 'components/common/Tabs'

import { useAppSelector } from 'util/store'

import { ProfileType } from 'types/profile'
import { ProgramType } from 'types/program'

import InviteButton from 'components/features/job/InviteButton'
import ProfileLink from 'components/features/profile/ProfileLink'
import ProgramList from 'components/features/program/List'
import List from 'components/features/util/List'
import TagsList from 'components/features/util/TagsList'
import withAuth from 'components/hoc/withAuth'
import PageLayout from 'components/layouts/Page'
import SectionLayout from 'components/layouts/Section'
import { getProfileById, profilesApi } from 'services/profiles'
import { getProgramsByOwner } from 'services/program'

type ProfilePageProps = {
  profile: ProfileType | null
  programs: ProgramType[]
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const data: ProfilePageProps = {
    profile: null,
    programs: [],
  }
  const profile = await getProfileById(context.query.profileId as string)
  data.profile = profile || null

  if (profile) {
    const programs = await getProgramsByOwner(profile.id)
    data.programs = programs
  }

  return {
    props: data,
  }
}

const ProfilePage: NextPage<ProfilePageProps> = ({ profile, programs }) => {
  const [tab, setTab] = useState<number>()
  const { user } = useAppSelector((state) => state.user)

  const { data: invited } = profilesApi.useGetIsCoachInvitedQuery({
    coachId: profile?.id,
    clientId: user?.id,
  })

  useEffect(() => {
    if (profile?.coach) {
      setTab(0)
    } else if (profile?.client) {
      setTab(1)
    }
  }, [profile])

  const isMultipleProfile = profile?.client && profile?.coach

  return (
    <PageLayout
      title={
        profile
          ? `${profile?.firstName} ${profile?.lastName}`
          : 'Profile not found'
      }
      notFound={!profile}
    >
      <div className="flex flex-row gap-x-4 items-center">
        {profile?.profileImage?.url && (
          <Image
            className="rounded-full"
            src={profile?.profileImage.url}
            alt="profile"
            width={75}
            height={75}
          />
        )}
        <div className="flex flex-col">
          <h1>
            {profile?.firstName} {profile?.lastName}
            {profile?.coach?.businessName && (
              <span className="ml-2 text-md font-normal">
                ({profile?.coach?.businessName})
              </span>
            )}
          </h1>
          <p>{profile?.city}</p>
        </div>
        <div className="flex flex-row items-center ml-auto">
          {invited?.isInvited && (
            <p className="flex flex-row items-center text-gray-600">
              <Icon className="mr-1" icon="info-circle" /> this coach is invited
              to one of your open jobs
            </p>
          )}
          {profile?.coach && user && profile.id !== user?.id && (
            <InviteButton className="ml-2" coachId={profile.id} />
          )}
        </div>
      </div>
      {isMultipleProfile && (
        <Tabs
          className="mt-4"
          size="lg"
          items={['As a coach', 'As a client']}
          value={tab}
          onValueChange={setTab}
        />
      )}
      <div className="flex flex-col gap-y-8 mt-8">
        {tab === 0 ? (
          <>
            <p>{profile?.coach?.description}</p>
            {profile?.coach?.tags && profile?.coach?.tags.length > 0 && (
              <SectionLayout title="Areas of expertise">
                <TagsList tags={profile.coach.tags} />
              </SectionLayout>
            )}

            {programs.length > 0 && (
              <SectionLayout title="Programs">
                <ProgramList programs={programs} />
              </SectionLayout>
            )}

            {profile?.coach?.links && profile?.coach?.links.length > 0 && (
              <SectionLayout title="Links">
                <List
                  items={profile.coach.links.map((link, idx) => (
                    <ProfileLink url={link} key={idx} />
                  ))}
                />
              </SectionLayout>
            )}
            {profile?.coach?.education && profile?.coach?.education.length > 0 && (
              <SectionLayout title="Education">
                <List items={profile.coach.education} />
              </SectionLayout>
            )}
            {profile?.coach?.certifications &&
              profile?.coach?.certifications.length > 0 && (
                <SectionLayout title="Certifications">
                  <List items={profile.coach.certifications} />
                </SectionLayout>
              )}
            {profile?.coach?.experience &&
              profile?.coach?.experience.length > 0 && (
                <SectionLayout title="Experience">
                  <List items={profile.coach.experience} />
                </SectionLayout>
              )}
          </>
        ) : (
          <>
            <p>{profile?.client?.description}</p>

            {profile?.client?.tags && profile?.client?.tags.length > 0 && (
              <SectionLayout title="Areas of interest">
                <TagsList tags={profile.client.tags} />
              </SectionLayout>
            )}
          </>
        )}
      </div>
    </PageLayout>
  )
}
export default withAuth(ProfilePage, {
  checkUser: false,
  checkProfile: false,
})
