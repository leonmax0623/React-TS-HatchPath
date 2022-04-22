import Image from 'next/image'
import Link from 'next/link'

import { APP_NAME } from 'util/constants'

import { CommonProps } from 'types/common'

import LogoImg from 'public/branding/logo.svg'

type LogoProps = CommonProps & {
  href?: string
}
const Logo = ({ id, className, href = '/' }: LogoProps) => {
  return (
    <Link href={href} passHref>
      <a>
        <Image
          id={id}
          className={className}
          src={LogoImg}
          alt={`${APP_NAME} logo`}
          width={175}
          height={50}
        />
      </a>
    </Link>
  )
}
export default Logo
