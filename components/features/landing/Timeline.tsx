import Image from 'next/image'

import Icon, { IconName } from 'components/common/Icon'

import cn from 'util/classnames'
import { APP_NAME } from 'util/constants'

import { CommonProps } from 'types/common'

const Woman = ({
  id,
  className,
  mode = 'single',
}: CommonProps & { mode?: 'single' | 'double' }) => {
  return (
    <div
      id={id}
      className={cn('flex flex-row justify-center items-center', className)}
    >
      {mode === 'single' ? (
        <Image
          className="rounded-full"
          src="/landing/woman_left.jpeg"
          alt={`woman ${mode}`}
          width={100}
          height={100}
          objectFit="cover"
        />
      ) : (
        <>
          <div className="-mr-3">
            <Image
              className="rounded-full"
              src="/landing/woman_left.jpeg"
              alt={`woman ${mode}`}
              width={100}
              height={100}
              objectFit="cover"
            />
          </div>
          <div className="-ml-3">
            <Image
              className="rounded-full"
              src="/landing/woman_right.jpeg"
              alt={`woman ${mode}`}
              width={100}
              height={100}
              objectFit="cover"
            />
          </div>
        </>
      )}
    </div>
  )
}

type TimelineProps = CommonProps
const Timeline = ({ id, className }: TimelineProps) => {
  return (
    <div id={id} className={cn('flex flex-col gap-y-8 md:flex-row', className)}>
      {[
        {
          label: `Sign up for ${APP_NAME} and enter your areas of interest.`,
          image: 'single',
          icon: 'comment-lines',
        },
        {
          label: 'Begin searching from our network of coaches.',
          image: 'single',
          icon: 'magnifying-glass',
        },
        {
          label: 'List a job and invite coaches to apply to be your coach',
          image: 'double',
          icon: 'share-nodes',
        },
        {
          label:
            'Select the coach that best suits your needs and book your first session with them.',
          image: 'double',
          icon: 'circle-dollar',
        },
        {
          label: `Host your session directly on ${APP_NAME} through our video call integration`,
          image: 'double',
          icon: 'camcorder',
        },
        {
          label: "Review your coach's performance after each session",
          image: 'single',
          icon: 'star-half-stroke',
        },
      ].map(({ label, image, icon }, idx) => (
        <div className={cn('min-w-40 text-center')} key={idx}>
          <Icon className="w-6 !h-6 text-white" icon={icon as IconName} />
          <div className="flex flex-row items-center w-full h-30">
            <div className="flex flex-col grow items-center">
              {idx > 0 && (
                <div className="w-full h-0.5 bg-none md:bg-white"></div>
              )}
            </div>
            <Woman mode={image === 'double' ? 'double' : 'single'} />
            <div className="flex flex-col grow items-center">
              {idx < 5 && (
                <div className="w-full h-0.5 bg-none md:bg-white"></div>
              )}
            </div>
          </div>
          <p className="px-1 mt-2 max-w-60 font-title text-xl text-center text-white">
            {label}
          </p>
        </div>
      ))}
    </div>
  )
}
export default Timeline
