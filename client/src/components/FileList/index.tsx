import { Checkbox, Flex, PropsOf, Skeleton, Table, Tbody, Td, Tr } from '@chakra-ui/react';
import byteSize from 'byte-size';
import { useMemo } from 'react';
import { Column, ColumnInstance, PluginHook, useRowSelect, useSortBy, useTable } from 'react-table';
import FileListHeader from './FileListHeader';
import FileListBody from './FileListBody';
import { Res } from '../../@types';

/**
 * Custom header content for selection column added by useRowSelect
 */
const SelectionHeader: ColumnInstance<Res>['Header'] = ({ getToggleAllRowsSelectedProps }) => {
  const { checked, indeterminate, ...rest } = getToggleAllRowsSelectedProps();
  return (
    <Flex justify="center" w="100%">
      <Checkbox isChecked={checked} isIndeterminate={indeterminate} {...rest} />
    </Flex>
  );
};

/**
 * Custom cell content for selection column added by useRowSelect
 */
const SelectionCell: ColumnInstance<Res>['Cell'] = ({ row }) => {
  const { checked, indeterminate, ...rest } = row.getToggleRowSelectedProps();
  return (
    <Flex justify="center">
      <Checkbox isChecked={checked} isIndeterminate={indeterminate} {...rest} />
    </Flex>
  );
};

/**
 * Customizes the selection column created by useRowSelect
 */
const selectionColumnHook: PluginHook<Res> = (hooks) => {
  hooks.visibleColumns.push((columns) => [
    {
      id: 'selection',
      Header: SelectionHeader,
      Cell: SelectionCell,
      minWidth: 10,
      width: 2,
    },
    ...columns,
  ]);
};

const bodySkeleton = (
  <Tbody>
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <Tr key={i}>
        <Td>
          <Skeleton height={4} />
        </Td>
        <Td>
          <Skeleton height={4} />
        </Td>
        <Td>
          <Skeleton height={4} />
        </Td>
        <Td>
          <Skeleton height={4} />
        </Td>
      </Tr>
    ))}
  </Tbody>
);

type FileListProps = {
  loading: boolean;
  data: Res[];
  onDirectoryClick: PropsOf<typeof FileListBody>['onDirectoryClick'];
};

const FileList = ({ loading, data, onDirectoryClick }: FileListProps) => {
  const columns = useMemo<Column<Res>[]>(
    () => [
      { Header: 'Name', accessor: 'name', width: 200 },
      {
        Header: 'Size',
        accessor: 'size',
        Cell: ({ cell: { value } }) => (value ? byteSize(value).toString() : ''),
        width: 20,
      },
      {
        id: 'type',
        Header: 'Type',
        accessor: 'type',
        width: 20,
      },
    ],
    []
  );

  const memoedData = useMemo(() => data, [data]);

  const { getTableBodyProps, getTableProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data: memoedData,
      initialState: {
        sortBy: [{ id: 'type', desc: false }],
      },
      autoResetSortBy: false,
    },
    useSortBy,
    useRowSelect,
    selectionColumnHook
  );

  return (
    <Flex justify="center">
      <Flex w={['100%', null, null, '75%']} borderRadius="1rem" borderWidth="2px" p={2}>
        <Table {...getTableProps()} size="sm">
          <FileListHeader headerGroups={headerGroups} />
          {loading ? (
            bodySkeleton
          ) : (
            <FileListBody
              rows={rows}
              getTableBodyProps={getTableBodyProps}
              prepareRow={prepareRow}
              onDirectoryClick={onDirectoryClick}
            />
          )}
        </Table>
      </Flex>
    </Flex>
  );
};

export default FileList;
