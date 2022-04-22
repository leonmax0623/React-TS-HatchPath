import { range } from 'util/list'

import Table from '.'

const DATA = range(0, 100).map((i) => ({
  'column 1': `row ${i}`,
  'column 2': `row ${i}`,
  'column 3': `row ${i}`,
  'column 4': `row ${i}`,
}))
const TablePalette = () => {
  return (
    <Table
      data={DATA}
      columns={[
        {
          Header: 'Column 1',
          accessor: 'column 1',
        },
        {
          Header: 'Column 2',
          accessor: 'column 2',
        },
        {
          Header: 'Column 3',
          accessor: 'column 3',
        },
        {
          Header: 'Column 4',
          accessor: 'column 4',
        },
      ]}
    />
  )
}
export default TablePalette
