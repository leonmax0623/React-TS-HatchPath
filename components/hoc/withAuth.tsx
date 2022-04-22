/* eslint-disable react/display-name */
import { useRouter } from 'next/router'
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import Loader from 'components/common/Loader'

import { useAppDispatch, useAppSelector } from 'util/store'

import { getProfile } from 'slices/profile'

import { ProfileType } from 'types/profile'

const withAuth = <T,>(
  WrappedComponent: FunctionComponent<T>,
  {
    checkUser = true,
    checkProfile = true,
    profileType = 'any',
    checkIsCoachApproved = true,
  }: {
    checkUser?: boolean
    checkProfile?: boolean
    profileType?: 'client' | 'coach' | 'any'
    checkIsCoachApproved?: boolean
  },
) => {
  return (props: T) => {
    const {
      user: { initiated: userInitiated, user },
      profile: { initiated: profileInitiated, profile },
    } = useAppSelector((state) => state)
    const dispatch = useAppDispatch()
    const router = useRouter()
    const [userChecked, setUserChecked] = useState<boolean>(false)
    const [profileChecked, setProfileChecked] = useState<boolean>(false)

    useEffect(() => {
      // only check this at the start to prevent weird redirects
      if (!userChecked && userInitiated) {
        if (!user && checkUser) {
          router.push({
            pathname: '/auth',
            query: {
              next: router.asPath,
            },
          })
        }
        setUserChecked(true)
      }
    }, [userInitiated, user, router, userChecked])

    const redirectByProfile = useCallback(
      (profile: ProfileType | undefined) => {
        if (checkProfile) {
          if (
            !profile ||
            (profileType === 'client' && !profile.client) ||
            (profileType === 'coach' && !profile.coach)
          ) {
            router.push(
              `/profile/edit${
                profileType ? `?tab=${profileType === 'coach' ? 2 : 1}` : ''
              }`,
            )
          } else if (
            checkIsCoachApproved &&
            profileType === 'coach' &&
            profile.coach?.decision !== 'approved'
          ) {
            router.push('/coach/review')
          }
        }
      },
      [router],
    )
    useEffect(() => {
      if (userInitiated && userChecked && user) {
        if (!profileInitiated) {
          dispatch(getProfile(user.id)).then((response) => {
            if (getProfile.fulfilled.match(response)) {
              redirectByProfile(response.payload as ProfileType)
            } else {
              router.push('/500')
            }
            setProfileChecked(true)
          })
        } else {
          redirectByProfile(profile)
          setProfileChecked(true)
        }
      }
    }, [
      user,
      userInitiated,
      userChecked,
      profileInitiated,
      profile,
      router,
      dispatch,
      redirectByProfile,
    ])

    const isReady = useMemo(() => {
      const userReady = !checkUser || (userInitiated && userChecked && user)
      const profileReady =
        !checkProfile ||
        !checkUser ||
        (profileChecked && profileInitiated && profile)
      return userReady && profileReady
    }, [
      profile,
      user,
      profileChecked,
      userChecked,
      profileInitiated,
      userInitiated,
    ])

    return isReady ? <WrappedComponent {...props} /> : <Loader type="full" />
  }
}

export default withAuth
