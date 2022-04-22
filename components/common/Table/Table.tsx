import { useMemo } from 'react'

import {
  Column,
  useFlexLayout,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table'

import cn from 'util/classnames'
import { range } from 'util/list'

import { CommonProps } from 'types/common'

import Button, { IconButton } from '../Button'
import Icon from '../Icon'

export type ColumnType<T extends Record<string, unknown>> = Column<T>
type TableProps<T extends Record<string, unknown>> = CommonProps & {
  data: T[]
  columns: ColumnType<T>[]
  defaultPageSize?: number
  defaultSort?: {
    id: string
    desc: boolean
  }
}
const Table = <T extends Record<string, unknown>>({
  id,
  className,
  data,
  columns,
  defaultPageSize,
  defaultSort,
}: TableProps<T>): JSX.Element => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    gotoPage,
    previousPage,
    nextPage,
    canNextPage,
    canPreviousPage,
    pageCount,
    state: { pageIndex },
  } = useTable(
    {
      data,
      columns,
      initialState: {
        sortBy: defaultSort ? [defaultSort] : [],
        pageIndex: 0,
        pageSize: defaultPageSize || 10,
      },
    },
    useSortBy,
    usePagination,
    useFlexLayout,
  )

  const pageOptions = useMemo<number[]>(() => {
    const numBefore = Math.min(pageIndex, 2)
    const numAfter = Math.min(pageCount - pageIndex, 2 + 2 - numBefore)
    return range(pageIndex - numBefore, pageIndex + numAfter)
  }, [pageIndex, pageCount])

  return (
    <div id={id} className={cn('flex flex-col', className)}>
      <table {...getTableProps()} className="w-full">
        <thead>
          {headerGroups.map((headerGroup, idx) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={idx}>
              {headerGroup.headers.map((column, idx) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={idx}
                  className={cn(
                    'flex flex-row items-center p-2 mb-2 font-bold border-b-2 border-gray-300 bg-blueGray-50',
                    {
                      'justify-start': idx < 1,
                      'justify-end': idx >= 1,
                    },
                  )}
                >
                  {column.render('Header')}
                  {column.canSort && (
                    <Icon
                      className="ml-1 text-sm text-gray-500"
                      icon={
                        column.isSortedDesc
                          ? 'sort-down'
                          : column.isSortedDesc === false
                          ? 'sort-up'
                          : 'sort'
                      }
                    />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, rowIdx) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()} key={rowIdx} className="group">
                {row.cells.map((cell, cellIdx) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      key={cellIdx}
                      className={cn(
                        'flex flex-row items-center py-1 px-2',
                        {
                          'justify-start': cellIdx < 1,
                          'justify-end': cellIdx >= 1,
                        },
                        { 'border-t border-gray-200': rowIdx > 0 },
                      )}
                    >
                      {cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="flex flex-row justify-center items-center mt-3">
        <IconButton
          icon={{
            icon: 'angle-double-left',
          }}
          ariaLabel="First page"
          variant="text"
          onClick={() => gotoPage(0)}
          disabled={pageIndex === 0}
        />
        <IconButton
          className="mr-2"
          icon={{
            icon: 'angle-left',
          }}
          ariaLabel="Previous page"
          variant="text"
          disabled={!canPreviousPage}
          onClick={previousPage}
        />
        {pageOptions.map((number, idx) => (
          <Button
            key={idx}
            variant={number === pageIndex ? 'default' : 'text'}
            onClick={() => gotoPage(number)}
            size="sm"
          >
            {number + 1}
          </Button>
        ))}
        <IconButton
          className="ml-2"
          icon={{
            icon: 'angle-right',
          }}
          ariaLabel="Next page"
          variant="text"
          disabled={!canNextPage}
          onClick={nextPage}
        />
        <IconButton
          icon={{
            icon: 'angle-double-right',
          }}
          ariaLabel="Last page"
          variant="text"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={pageIndex === pageCount - 1}
        />
      </div>
    </div>
  )
}
export default Table
