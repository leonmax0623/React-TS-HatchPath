import cn from 'util/classnames'

import { CommonProps } from 'types/common'
import { ProgramType } from 'types/program'

import ProgramCard from './Card'

type ProgramListProps = CommonProps & {
  programs: ProgramType[]
}
const ProgramList = ({ id, className, programs }: ProgramListProps) => {
  return (
    <ul id={id} className={cn('grid grid-cols-12 gap-8 mt-4', className)}>
      {programs.map((program, idx) => (
        <li className="col-span-12 md:col-span-4" key={idx}>
          <ProgramCard program={program} />
        </li>
      ))}
    </ul>
  )
}
export default ProgramList
