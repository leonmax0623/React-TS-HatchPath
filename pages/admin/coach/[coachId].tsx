import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import dayjs from 'dayjs'

import Button from 'components/common/Button'
import { useToast } from 'components/common/Toast'

import { ProfileType } from 'types/profile'

import NumPreviousClients from 'components/features/profile/NumPreviousClients'
import ProfileLink from 'components/features/profile/ProfileLink'
import List from 'components/features/util/List'
import TagsList from 'components/features/util/TagsList'
import withAuth from 'components/hoc/withAuth'
import PageLayout from 'components/layouts/Page'
import SectionLayout from 'components/layouts/Section'
import { adminApi } from 'services/admin'

const CoachPage: NextPage = () => {
  const router = useRouter()
  const { error, toast } = useToast()
  const { data, isLoading, isError } = adminApi.useGetCoachQuery(
    router.query.coachId as string,
  )
  const [approveCoach, { isLoading: approving }] =
    adminApi.useApproveCoachMutation()
  const [rejectCoach, { isLoading: rejecting }] =
    adminApi.useRejectCoachMutation()

  const profile = useMemo<ProfileType | undefined>(
    () => data || undefined,
    [data],
  )

  const onApprove = async () => {
    if (profile) {
      try {
        await approveCoach(profile.id).unwrap()
        toast({
          title: 'Profile approved',
          description: 'Succesfully approved coach profile',
          type: 'success',
        })
        router.push('/admin/coach')
      } catch (err) {
        error()
      }
    }
  }
  const onReject = async () => {
    if (profile) {
      try {
        await rejectCoach(profile.id).unwrap()
        toast({
          title: 'Profile rejected',
          description: 'Succesfully rejected coach profile',
          type: 'success',
        })
        router.push('/admin/coach')
      } catch (err) {
        error()
      }
    }
  }

  return (
    <PageLayout
      title={profile ? `${profile?.firstName} ${profile?.lastName}` : 'Profile'}
      loading={isLoading}
      error={isError}
      notFound={!profile}
    >
      {profile && profile.coach && (
        <>
          <Button
            leftIcon={{ icon: 'angle-left' }}
            href="/admin/coach"
            variant="link"
          >
            Back to coaches
          </Button>
          <h1>
            {profile?.firstName} {profile?.lastName}
            {profile?.coach?.businessName && (
              <span className="ml-2 text-md font-normal">
                ({profile?.coach?.businessName})
              </span>
            )}
          </h1>
          {profile?.city && <p>{profile?.city}</p>}
          <p className="my-4">{profile?.coach?.description}</p>
          <div className="flex flex-col gap-y-6">
            {[
              {
                label: 'Submitted',
                content: dayjs(profile?.coach?.createdTime).format(
                  'MMM DD, YYYY - h:mm A',
                ),
              },
              {
                label: 'Birthday',
                content: `${dayjs(profile.dateOfBirth).format(
                  'MMM DD, YYYY',
                )} - ${dayjs().diff(profile.dateOfBirth, 'year')} years old`,
              },
              {
                label: 'Tags',
                content: profile.coach.tags.length ? (
                  <TagsList tags={profile.coach.tags} />
                ) : (
                  'No tags'
                ),
              },
              {
                label: 'Number of previous clients',
                content: (
                  <NumPreviousClients
                    value={profile?.coach?.numPreviousClients}
                  />
                ),
              },
              {
                label: 'Links',
                content:
                  profile?.coach?.links?.length > 0 ? (
                    <List
                      items={profile?.coach?.links.map((link, idx) => (
                        <ProfileLink url={link} key={idx} />
                      ))}
                    />
                  ) : (
                    'No links'
                  ),
              },
              {
                label: 'Education',
                content:
                  profile?.coach?.education?.length > 0 ? (
                    <List items={profile.coach.education} />
                  ) : (
                    'No education history'
                  ),
              },
              {
                label: 'Certifications',
                content: profile?.coach?.certifications.length ? (
                  <List items={profile.coach.certifications} />
                ) : (
                  'No certifications'
                ),
              },
              {
                label: 'Experience',
                content: profile?.coach?.experience.length ? (
                  <List items={profile.coach.experience} />
                ) : (
                  'No experience'
                ),
              },
            ].map(({ label, content }, idx) => (
              <SectionLayout title={label} key={idx}>
                {content}
              </SectionLayout>
            ))}
          </div>
          <div className="flex flex-row gap-x-2 items-center mt-8">
            {profile.coach.decision !== 'rejected' && (
              <Button
                leftIcon={{ icon: 'times' }}
                loading={rejecting}
                onClick={onReject}
                color="error"
              >
                Reject
              </Button>
            )}
            {profile.coach.decision !== 'approved' && (
              <Button
                leftIcon={{ icon: 'check' }}
                loading={approving}
                onClick={onApprove}
              >
                Approve
              </Button>
            )}
          </div>
        </>
      )}
    </PageLayout>
  )
}
export default withAuth(CoachPage, {
  checkProfile: false,
})
