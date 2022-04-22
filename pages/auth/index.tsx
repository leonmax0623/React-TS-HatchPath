import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import * as React from 'react'

import Button from 'components/common/Button'
import Loader from 'components/common/Loader'
import { useToast } from 'components/common/Toast'

import { useAppDispatch, useAppSelector } from 'util/store'

import { login } from 'slices/user'

import { ProfileType } from 'types/profile'

import LoginForm from 'components/forms/auth/Login'
import PasswordResetForm from 'components/forms/auth/PasswordReset'
import RegisterForm from 'components/forms/auth/Register'
import withAuth from 'components/hoc/withAuth'
import PageLayout from 'components/layouts/Page'

import { ALLOWED_COUNTRY_CODES } from '../../util/constants'

type ModeType = 'login' | 'register' | 'return'

const AuthPage: NextPage = () => {
  const {
    user: { user, initiated },
    profile: { profile },
    geo_location: { country_code },
  } = useAppSelector((state) => state)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { error, toast } = useToast()
  const [mode, setMode] = useState<ModeType>()
  const [showReset, setShowReset] = useState<boolean>(false)
  const [validCountryCode, setValidCountryCode] = useState<boolean>(true)

  useEffect(() => {
    // Checks if current users country_code is valid
    if (country_code) {
      if (ALLOWED_COUNTRY_CODES.includes(country_code)) {
        setValidCountryCode(true)
      } else {
        setValidCountryCode(false)
      }
    }
  }, [country_code])

  useEffect(() => {
    if (!mode && initiated) {
      switch (router.query.mode) {
        case 'login':
        case 'register':
        case 'return':
          setMode(router.query.mode)
          break
        default:
          if (user && user.isEmailVerified) {
            setMode('return')
          } else {
            setMode('login')
          }
          break
      }
    }
  }, [mode, router.query, initiated, user])

  useEffect(() => {
    if (router.query.mode == 'register' && !validCountryCode) {
      router.push('/unsupported-country')
    }
  }, [validCountryCode, router])

  const onSwitchMode = useCallback(
    (next: ModeType) => {
      setMode(next)
      router.push({ query: { ...router.query, mode: next } })
    },
    [router],
  )

  const onSuccess = useCallback(
    (profile: ProfileType | undefined) => {
      if (profile && (profile.client || profile.coach)) {
        if (router.query.next) {
          router.push(router.query.next as string)
        } else {
          if (profile.coach && (!profile.client || profile.mode === 'coach')) {
            if (profile.coach.decision === 'approved') {
              router.push('/coach/home')
            } else {
              router.push('/coach/review')
            }
          } else {
            router.push('/client/home')
          }
        }
      } else {
        router.push('/profile/create')
      }
    },
    [router],
  )

  const onSocialLogin = async (social: 'facebook' | 'google') => {
    const response = await dispatch(login({ social, validCountryCode }))
    if (login.fulfilled.match(response)) {
      onSuccess(response.payload.profile)
    } else if (response.payload == 'INVALID_COUNTRY_CODE') {
      router.push('/unsupported-country')
    } else {
      error()
    }
  }

  return (
    <PageLayout
      contentClassName="flex flex-col items-center justify-start sm:justify-center h-full"
      isHeaderHidden={true}
      isPagePublic={true}
    >
      <div className="flex flex-col py-3 px-4 w-full sm:w-108">
        {!initiated ? (
          <Loader type="text" className="mx-auto mt-4" />
        ) : mode === 'return' ? (
          <>
            <h1 className="text-4xl text-center">Welcome back {user?.name}</h1>
            <Button className="mt-5" onClick={() => onSuccess(profile)}>
              Log in as {user?.email}
            </Button>
            <Button
              className="mt-4 !w-full"
              variant="text"
              onClick={() => onSwitchMode('login')}
              size="sm"
            >
              Not you?
            </Button>
          </>
        ) : mode === 'register' ? (
          <>
            <h1 className="text-4xl text-center">Create a new account</h1>
            <RegisterForm
              className="w-full"
              onRegister={() => onSuccess(undefined)}
            />
            <div className="flex flex-col gap-y-2 py-4 my-4 border-y border-gray-300">
              <Button
                className="!w-full !bg-[#4267b2]"
                leftIcon={{ icon: 'facebook', variant: 'brand' }}
                onClick={() => onSocialLogin('facebook')}
              >
                Register With Facebook
              </Button>
              <Button
                className="!w-full !bg-[#4185f4]"
                leftIcon={{ icon: 'google', variant: 'brand' }}
                onClick={() => onSocialLogin('google')}
              >
                Register With Google
              </Button>
            </div>
            <Button
              className="mt-4 !w-full"
              variant="text"
              onClick={() => onSwitchMode('login')}
              size="sm"
            >
              Already have an account? Log in
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-4xl text-center">Log in to your account</h1>
            <LoginForm
              className="w-full"
              onLogin={onSuccess}
              onPasswordReset={() => setShowReset(true)}
            />
            <div className="flex flex-col gap-y-2 py-4 my-4 border-y border-gray-300">
              <Button
                className="!w-full !bg-[#4267b2]"
                leftIcon={{ icon: 'facebook', variant: 'brand' }}
                onClick={() => onSocialLogin('facebook')}
              >
                Login With Facebook
              </Button>
              <Button
                className="!w-full !bg-[#4185f4]"
                leftIcon={{ icon: 'google', variant: 'brand' }}
                onClick={() => onSocialLogin('google')}
              >
                Login With Google
              </Button>
            </div>
            <Button
              variant="text"
              onClick={() => onSwitchMode('register')}
              size="sm"
            >
              Don&apos;t have an account? Sign up
            </Button>
          </>
        )}
      </div>
      <PasswordResetForm
        open={showReset}
        onClose={() => setShowReset(false)}
        onSent={() => {
          toast({
            title: 'Password reset sent',
            description:
              'We sent you an email with instructions to reset your password',
            type: 'success',
          })
          setShowReset(false)
        }}
      />
    </PageLayout>
  )
}
export default withAuth(AuthPage, { checkUser: false, checkProfile: false })
