/* eslint-disable react/jsx-key */
import { Flex, Th, Thead, Tr } from '@chakra-ui/react';
import { RiArrowDownSFill, RiArrowUpSFill } from 'react-icons/ri';
import { TableInstance } from 'react-table';
import { Res } from '../../@types';

type UseTableReturn = TableInstance<Res>;

type FileListHeaderProps = {
  headerGroups: UseTableReturn['headerGroups'];
};

const FileListHeader = ({ headerGroups }: FileListHeaderProps) => {
  return (
    <Thead>
      {headerGroups.map((headerGroup) => (
        <Tr {...headerGroup.getHeaderGroupProps()} borderBottom="1.5px solid black">
          {headerGroup.headers.map((column) => (
            <Th
              {...column.getHeaderProps(column.getSortByToggleProps())}
              minW={column.minWidth}
              w={column.width}
            >
              <Flex justify="space-between" align="center">
                {column.render('Header')}{' '}
                {column.isSorted ? (
                  column.isSortedDesc ? (
                    <RiArrowDownSFill size="1rem" />
                  ) : (
                    <RiArrowUpSFill size="1rem" />
                  )
                ) : (
                  ''
                )}
              </Flex>
            </Th>
          ))}
        </Tr>
      ))}
    </Thead>
  );
};

export default FileListHeader;
