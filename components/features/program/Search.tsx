import Loader from 'components/common/Loader'

import cn from 'util/classnames'

import { CommonProps } from 'types/common'

import { programsApi } from 'services/program'

import ProgramList from './List'

type ProgramSearchProps = CommonProps & {
  search: string
}
const ProgramSearch = ({ id, className, search }: ProgramSearchProps) => {
  const { data: programs, isLoading } =
    programsApi.useSearchProgramsQuery(search)

  return (
    <div id={id} className={cn('flex flex-col gap-y-2', className)}>
      {isLoading && <Loader className="mx-auto" />}
      {programs?.length ? (
        <ProgramList programs={programs} />
      ) : (
        <p className="text-lg">No programs match your search</p>
      )}
    </div>
  )
}
export default ProgramSearch
