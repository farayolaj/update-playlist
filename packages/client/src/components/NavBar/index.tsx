import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Skeleton } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

type NavBarProps = {
  path: string;
  changeDirectory: (path: string) => void;
};

const NavBar = ({ path, changeDirectory }: NavBarProps) => {
  let link = '';

  const splitPaths = path ? path.split('\\') : [];
  return (
    <Flex justify="center">
      <Flex
        w={['100%', null, null, '75%']}
        h="2rem"
        borderRadius=".8rem"
        alignItems="center"
        px="2rem"
        borderWidth="2px"
        overflowX="auto"
      >
        <Breadcrumb separator={<ChevronRightIcon color="gray.500" />}>
          {!path
            ? [1, 2, 3].map((num) => (
                <BreadcrumbItem key={num}>
                  <Skeleton w="5rem" h="1rem" />
                </BreadcrumbItem>
              ))
            : splitPaths.map((item, idx) => {
                const cLink = !link ? item : link + '\\' + item;
                link = cLink;
                return (
                  <BreadcrumbItem key={item} isCurrentPage={idx === splitPaths.length - 1}>
                    <BreadcrumbLink onClick={() => changeDirectory(cLink)}>{item}</BreadcrumbLink>
                  </BreadcrumbItem>
                );
              })}
        </Breadcrumb>
      </Flex>
    </Flex>
  );
};

export default NavBar;
