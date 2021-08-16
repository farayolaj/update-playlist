/* eslint-disable react/jsx-key */
import { Tbody, Td, Tr } from '@chakra-ui/react';
import { TableInstance } from 'react-table';
import { Res } from '../../@types';

type UseTableReturn = TableInstance<Res>;

type FileListBodyProps = {
  getTableBodyProps: UseTableReturn['getTableBodyProps'];
  rows: UseTableReturn['rows'];
  prepareRow: UseTableReturn['prepareRow'];
  onDirectoryClick: (name: string) => void;
};

const FileListBody = ({
  getTableBodyProps,
  rows,
  prepareRow,
  onDirectoryClick,
}: FileListBodyProps) => {
  return (
    <Tbody {...getTableBodyProps()}>
      {rows.map((row) => {
        prepareRow(row);
        return (
          <Tr
            {...row.getRowProps()}
            _hover={{
              bgColor: 'gray.50',
            }}
            onClick={
              row.values.type === 'Directory' ? () => onDirectoryClick(row.values.name) : undefined
            }
          >
            {row.cells.map((cell) => (
              <Td
                {...cell.getCellProps()}
                cursor="default"
                minW={cell.column.minWidth}
                w={cell.column.width}
              >
                {cell.render('Cell')}
              </Td>
            ))}
          </Tr>
        );
      })}
    </Tbody>
  );
};

export default FileListBody;
