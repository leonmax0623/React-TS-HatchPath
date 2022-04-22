import { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image'

import Accordion from 'components/common/Accordion'
import Button from 'components/common/Button'
import Icon from 'components/common/Icon'

import { useAppSelector } from 'util/store'
import { usdFormat } from 'util/string'

import { ProfileType } from 'types/profile'
import { ProgramType } from 'types/program'

import InviteButton from 'components/features/job/InviteButton'
import TagsList from 'components/features/util/TagsList'
import withAuth from 'components/hoc/withAuth'
import PageLayout from 'components/layouts/Page'
import SectionLayout from 'components/layouts/Section'
import { getProfileById } from 'services/profiles'
import { getProgramById, programsApi } from 'services/program'

type ProgramPageProps = {
  program: ProgramType | null
  owner: ProfileType | null
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const data: ProgramPageProps = {
    program: null,
    owner: null,
  }
  const program = await getProgramById(context.query.programId as string)
  if (program) {
    data.program = program
    const owner = await getProfileById(program.owner)
    data.owner = owner || null
  }
  return {
    props: data,
  }
}

const ProgramPage: NextPage<ProgramPageProps> = ({ program, owner }) => {
  const {
    user: { user, initiated: userInitiated },
    profile: { profile, initiated: profileInitiated },
  } = useAppSelector((state) => state)

  const { data: invited } = programsApi.useGetIsProgramInvitedQuery({
    programId: program?.id,
    clientId: user?.id,
  })

  return (
    <PageLayout title={program?.title} notFound={!program}>
      {program?.banner?.url && (
        <div className="relative w-full h-80 bg-gray-100 rounded">
          <Image
            src={program?.banner?.url}
            alt="program banner"
            layout="fill"
            objectFit="contain"
          />
        </div>
      )}

      <div className="flex flex-col divide-y">
        <div className="py-4">
          <h1>{program?.title}</h1>
          <Button
            className="!font-normal"
            color="secondary"
            variant="link"
            href={`/profile/${owner?.id}`}
          >
            {owner?.coach?.businessName ||
              `${owner?.firstName} ${owner?.lastName}`}
          </Button>
          {invited?.isInvited && (
            <p className="flex flex-row items-center my-2 text-gray-600">
              <Icon className="mr-1" icon="info-circle" />
              This program is invited to one of your open jobs
            </p>
          )}
        </div>

        <div className="flex flex-row items-center py-4">
          <div>
            <div className="flex flex-row items-center">
              <div className="text-right">
                <p className="text-2xl font-semibold">
                  {program?.pricePerSession !== undefined &&
                  program.sessions.length
                    ? usdFormat.format(
                        program.pricePerSession * program.sessions.length,
                      )
                    : ''}
                </p>
                <p>for full program</p>
              </div>
              <div className="pl-6 ml-6 text-left border-l border-gray-200">
                <p className="text-2xl font-semibold">
                  {program?.pricePerSession !== undefined
                    ? usdFormat.format(program.pricePerSession)
                    : ''}
                </p>
                <p>per session</p>
              </div>
            </div>
            <p className="flex flex-row items-center mt-2 text-sm text-gray-600">
              <Icon className="mr-1" icon="info-circle" /> Exact pricing may
              differ depending on your job
            </p>
          </div>

          {userInitiated && (
            <div className="ml-auto">
              {user && owner && user?.id === owner?.id ? (
                <Button href={`/program/${program?.id}/manage`}>
                  Manage program
                </Button>
              ) : program?.isOpen ? (
                <>
                  {user ? (
                    <>
                      {profileInitiated && (
                        <>
                          {profile?.client ? (
                            <InviteButton
                              programId={program.id}
                              coachId={program.owner}
                            />
                          ) : (
                            <Button href="/profile/edit?tab=1">
                              Create a client profile to book
                            </Button>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <Button href="/auth?mode=register">Sign up to book!</Button>
                  )}
                </>
              ) : (
                <p>Program is not available for booking</p>
              )}
            </div>
          )}
        </div>
        {[
          {
            label: 'Tags',
            content: <TagsList tags={program?.tags || []} />,
          },
          {
            label: 'Description',
            content: <p>{program?.description}</p>,
          },
          {
            label: 'Program sessions',
            content: (
              <Accordion
                className="flex flex-col"
                headerClassName="bg-hatchBlack-500 hover:!bg-hatchBlack-700 py-2"
                labelClassName="text-white font-normal"
                iconClassName="!text-white"
                items={
                  program?.sessions.map(({ title, description }, idx) => ({
                    label: title,
                    content: <p key={idx}>{description}</p>,
                  })) || []
                }
              />
            ),
          },
          {
            label: 'Coached by',
            content: (
              <div>
                <div className="flex flex-row items-center">
                  {owner?.profileImage?.url && (
                    <div className="flex flex-col justify-center items-center mr-2">
                      <Image
                        className="rounded-full"
                        src={owner?.profileImage?.url}
                        alt="coach"
                        height={50}
                        width={50}
                      />
                    </div>
                  )}
                  <p className="text-xl font-semibold">
                    {owner?.firstName} {owner?.lastName}
                    {owner?.coach?.businessName && (
                      <span className="block text-sm font-light">
                        {owner?.coach?.businessName}
                      </span>
                    )}
                  </p>
                  <Button
                    className="ml-auto"
                    href={`/profile/${owner?.id}`}
                    target="_blank"
                    variant="link"
                    leftIcon={{
                      icon: 'external-link',
                    }}
                  >
                    Visit coach profile
                  </Button>
                </div>
                <p className="mt-2">{owner?.coach?.description}</p>
              </div>
            ),
          },
        ].map(({ label, content }, idx) => (
          <SectionLayout key={idx} className="py-4" title={label}>
            {content}
          </SectionLayout>
        ))}
      </div>
    </PageLayout>
  )
}
export default withAuth(ProgramPage, {
  checkProfile: false,
  checkUser: false,
})
