import Image from 'next/image'
import { useRouter } from 'next/router'

import Button from 'components/common/Button'
import Icon from 'components/common/Icon'
import Logo from 'components/common/Logo'
import PopoverMenu from 'components/common/PopoverMenu'

import cn from 'util/classnames'
import { isAdmin, isDev } from 'util/env'
import { useAppDispatch, useAppSelector } from 'util/store'

import { updateProfileMode } from 'slices/profile'
import { logout } from 'slices/user'

import { CommonProps } from 'types/common'

const NAV_LINK_CLASSNAMES = '!font-normal !text-sm tracking-wider uppercase'

type HeaderProps = CommonProps & {
  isPublic?: boolean
}
const Header = ({ id, className, isPublic = true }: HeaderProps) => {
  const {
    user: { user, initiated },
    profile: { profile },
  } = useAppSelector((state) => state)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const onMenuSelect = async (option: string) => {
    switch (option) {
      case 'profile':
        router.push(`/profile/${profile?.id}`)
        return
      case 'settings':
        router.push('/profile/settings')
        return
      case 'switch-client':
        await dispatch(updateProfileMode('client'))
        router.push('/client/home')
        return
      case 'switch-coach':
        await dispatch(updateProfileMode('coach'))
        router.push('/coach/home')
        return
      case 'logout':
        dispatch(logout())
        router.push('/')
        return
      default:
        return
    }
  }

  const notifications =
    profile?.mode === 'coach'
      ? profile?.coach?.notifications
      : profile?.client?.notifications

  return (
    <header
      id={id}
      className={cn(
        'flex flex-row justify-center items-center w-full',
        'py-2',
        {
          'border-b-2 border-gray-200': !!user && !isPublic,
        },
        {
          'bg-hatch-comfort': profile && profile.mode === 'coach',
        },
        className,
      )}
    >
      <div className="flex flex-row items-center px-5 w-full max-w-screen-xl">
        <Logo
          href={
            profile?.mode === 'coach'
              ? '/coach/home'
              : profile?.mode === 'client'
              ? '/client/home'
              : '/'
          }
        />
        {initiated && (
          <>
            {!!user && !isPublic && !isAdmin ? (
              <div className="flex flex-row grow items-center">
                <nav className="grow px-8">
                  <ul className="flex flex-row gap-x-4 items-center">
                    {[
                      {
                        label: 'Home',
                        isActive: router.pathname.includes('/home'),
                        href: '/home',
                      },
                      {
                        label: 'Explore',
                        isActive: router.pathname.includes('/explore'),
                        href: '/explore',
                        isGlobal: true,
                      },
                      {
                        label: 'Applications',
                        isActive: router.pathname.includes('/applications'),
                        href: '/applications',
                        show: profile?.mode === 'coach',
                      },
                      {
                        label: 'Jobs',
                        isActive: router.pathname.includes('/jobs'),
                        href: '/job',
                        show: profile?.mode !== 'coach',
                      },
                      {
                        label: 'Enrollments',
                        isActive: router.pathname.includes('/enrollment'),
                        href: '/enrollment',
                        isGlobal: true,
                      },
                    ]
                      .filter(({ show }) => show === undefined || show === true)
                      .map(({ label, isActive, href, isGlobal }, idx) => (
                        <li key={idx}>
                          <Button
                            className={cn(NAV_LINK_CLASSNAMES, {
                              '!font-bold !text-gray-800': isActive,
                            })}
                            variant="link"
                            color="secondary"
                            href={
                              isGlobal
                                ? href
                                : `/${
                                    profile?.mode === 'client'
                                      ? 'client'
                                      : 'coach'
                                  }${href}`
                            }
                          >
                            {label}
                          </Button>
                        </li>
                      ))}
                  </ul>
                </nav>
                <div className="flex flex-row gap-x-2 items-center">
                  {notifications && Object.keys(notifications).length > 0 && (
                    <PopoverMenu
                      id={id}
                      className={className}
                      items={Object.values(notifications).map(
                        ({ message, href }) => ({
                          label: message,
                          value: href,
                          icon: {
                            icon: 'bell',
                          },
                        }),
                      )}
                      trigger={{
                        children: <Icon icon="bell" />,
                        variant: 'link',
                        color: 'secondary',
                      }}
                      onSelect={(href) => router.push(href)}
                    />
                  )}

                  <PopoverMenu
                    items={[
                      {
                        label: 'View your profile',
                        value: 'profile',
                        icon: {
                          icon: 'user',
                        },
                      },
                      {
                        label: `Switch to ${
                          profile?.mode === 'client' ? 'coach' : 'client'
                        } view`,
                        value:
                          profile?.mode === 'client'
                            ? 'switch-coach'
                            : 'switch-client',
                        icon: {
                          icon: 'repeat',
                        },
                      },
                      {
                        label: 'Settings',
                        value: 'settings',
                        icon: { icon: 'cog' },
                      },
                      {
                        label: 'Logout',
                        value: 'logout',
                        icon: { icon: 'sign-out' },
                      },
                    ]}
                    trigger={{
                      className: NAV_LINK_CLASSNAMES,
                      children: (
                        <div className="flex flex-row gap-x-2 items-center">
                          {profile?.profileImage &&
                            profile?.profileImage.url && (
                              <Image
                                className="rounded-full"
                                width={30}
                                height={30}
                                src={profile.profileImage.url}
                                alt="profile"
                              />
                            )}
                          <div className="">
                            <span>
                              {profile?.firstName} {profile?.lastName}
                            </span>
                            {profile?.mode === 'coach' && (
                              <span className="ml-1 text-xs font-light lowercase">
                                (coach)
                              </span>
                            )}
                          </div>
                        </div>
                      ),
                      rightIcon: {
                        icon: 'chevron-down',
                      },
                      variant: 'link',
                      color: 'secondary',
                    }}
                    onSelect={onMenuSelect}
                  />
                </div>
              </div>
            ) : !!user && isAdmin ? (
              <div className="flex flex-row grow items-center">
                <nav className="grow px-8">
                  <ul className="flex flex-row gap-x-4 items-center">
                    {[
                      {
                        label: 'Waitlist',
                        isActive: router.pathname.includes('/admin/waitlist'),
                        href: '/admin/waitlist',
                      },
                      {
                        label: 'Coaches',
                        isActive: router.pathname.includes('/admin/coach'),
                        href: '/admin/coach',
                      },
                      ...(isDev
                        ? [
                            {
                              label: 'Dev Tools',
                              isActive: router.pathname.includes('/admin/dev'),
                              href: '/admin/dev',
                            },
                          ]
                        : []),
                    ].map(({ label, isActive, href }, idx) => (
                      <li key={idx}>
                        <Button
                          className={cn(
                            '!text-sm !font-normal tracking-wider uppercase',
                            {
                              '!font-bold !text-gray-800 !underline': isActive,
                            },
                          )}
                          variant="link"
                          color="secondary"
                          href={href}
                        >
                          {label}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </nav>
                <Button
                  className=""
                  variant="outlined"
                  size="sm"
                  leftIcon={{ icon: 'sign-out' }}
                  onClick={() => {
                    dispatch(logout())
                    router.push('/')
                  }}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-row grow gap-x-8 justify-end items-center px-8">
                {[
                  {
                    title: 'Explore',
                    href: '/client/search',
                  },
                  {
                    title: 'Log in',
                    href: '/auth',
                  },
                ].map(({ title, href }, idx) => (
                  <Button
                    key={idx}
                    className={NAV_LINK_CLASSNAMES}
                    variant="link"
                    color="black"
                    href={href}
                  >
                    {title}
                  </Button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </header>
  )
}
export default Header
