import Head from 'next/head'
import { PropsWithChildren, useMemo } from 'react'

import dayjs from 'dayjs'

import Alert from 'components/common/Alert'
import Button from 'components/common/Button'
import Loader from 'components/common/Loader'

import cn from 'util/classnames'
import {
  APP_NAME,
  DEFAULT_PAGE_DESCRIPTION,
  GENERIC_ERROR,
} from 'util/constants'
import { isAdmin } from 'util/env'
import { useAppSelector } from 'util/store'

import { CommonProps } from 'types/common'

import Header from './Header'

type PageLayoutProps = PropsWithChildren<
  CommonProps & {
    headerClassName?: string
    contentClassName?: string
    footerClassName?: string
    // SEO props
    title?: string
    isTitleSuffixHidden?: boolean
    isHeaderHidden?: boolean
    isPagePublic?: boolean
    isFooterHidden?: boolean
    description?: string
    // content props
    isContentConstrained?: boolean
    loading?: boolean
    error?: boolean
    notFound?: boolean
  }
>
const PageLayout = ({
  id,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  // SEO props
  title,
  isTitleSuffixHidden = false,
  isHeaderHidden = false,
  isPagePublic = false,
  isFooterHidden = false,
  description = DEFAULT_PAGE_DESCRIPTION,
  // content props
  isContentConstrained = true,
  loading = false,
  error = false,
  notFound = false,
  children,
}: PageLayoutProps) => {
  const { user } = useAppSelector((state) => state.user)
  const pageTitle = useMemo<string>(
    () =>
      title
        ? `${title}${isTitleSuffixHidden ? '' : ` | ${APP_NAME}`}`
        : APP_NAME,
    [title, isTitleSuffixHidden],
  )

  return (
    <div
      id={id}
      className={cn(
        'flex overflow-x-hidden flex-col items-center w-full h-full',
        className,
      )}
    >
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/branding/favicon.ico" />
      </Head>
      {!isHeaderHidden && (
        <Header className={headerClassName} isPublic={isPagePublic} />
      )}
      <div className="w-full">
        {!isPagePublic && !isAdmin && user && user && !user.isEmailVerified && (
          <Alert
            type="warning"
            title="Email not verified"
            description={
              <p>
                Your HatchPath account will be limited until you verify your
                email.{' '}
                <Button variant="link" href="/auth/email">
                  Click here
                </Button>{' '}
                to verify your email.{' '}
              </p>
            }
          />
        )}
        {error && (
          <Alert
            type="error"
            title="Unexpected problem"
            description={GENERIC_ERROR}
          />
        )}
      </div>
      <main
        className={cn(
          'grow px-5 pt-5 w-full',
          { 'max-w-screen-xl': isContentConstrained },
          contentClassName,
        )}
      >
        {loading ? (
          <Loader type="full" />
        ) : notFound ? (
          <div className="flex flex-col justify-center items-center w-full h-full">
            <h1>404: Page not found</h1>
          </div>
        ) : (
          children
        )}
      </main>
      {!isFooterHidden && (
        <footer
          className={cn('flex flex-col items-center py-2', footerClassName)}
        >
          <p className="text-xs text-gray-500">
            &copy; {APP_NAME} {dayjs().format('YYYY')}
          </p>
        </footer>
      )}
    </div>
  )
}
export default PageLayout
