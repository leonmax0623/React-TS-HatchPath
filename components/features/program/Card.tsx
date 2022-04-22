import Image from 'next/image'
import Link from 'next/link'

import Icon from 'components/common/Icon'

import cn from 'util/classnames'

import { CommonProps } from 'types/common'
import { ProgramType } from 'types/program'

type ProgramCardProps = CommonProps & {
  program: ProgramType
}
const ProgramCard = ({ id, className, program }: ProgramCardProps) => {
  return (
    <div id={id} className={cn('rounded cursor-pointer', className)}>
      <Link href={`/program/${program.id}`} passHref={true}>
        <a className="flex flex-col w-full h-full">
          <div className="flex relative flex-col justify-center items-center w-full h-50 bg-gray-500 rounded">
            {program.banner && program.banner.url ? (
              <Image
                src={program.banner.url}
                alt="program banner"
                layout="fill"
                objectFit="contain"
              />
            ) : (
              <Icon icon="image-slash" className="!w-10 !h-10 text-white" />
            )}
          </div>
          <h3>{program.title}</h3>
        </a>
      </Link>
    </div>
  )
}
export default ProgramCard
