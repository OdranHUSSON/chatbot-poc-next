import { Box, Flex, Text, Badge } from '@chakra-ui/react';
import { FaCircle } from 'react-icons/fa';
import { useCallback } from 'react';
import { usePathname } from 'next/navigation';

const MenuButton = ({ route, activeRoute, gray, activeIcon, inactiveColor, activeColor, badge }) => {
  const pathname = usePathname();

  return (
    <Flex w="100%" alignItems="center" justifyContent="center">
      <Box color={route.disabled ? gray : activeRoute(route.path.toLowerCase()) ? activeIcon : inactiveColor} me="12px" mt="6px">
        {route.icon}
      </Box>
      <Text me="auto" color={route.disabled ? gray : activeRoute(route.path.toLowerCase()) ? activeColor : 'gray.500'} fontWeight="500" letterSpacing="0px" fontSize="sm">
        {route.name}
      </Text>
      {badge && badge !== '' && (
        <Badge display={{ base: 'flex', lg: 'none', xl: 'flex' }} colorScheme="brand" borderRadius="25px" color="brand.500" textTransform={'none'} letterSpacing="0px" px="8px">
          {badge}
        </Badge>
      )}
    </Flex>
  );
};

export default MenuButton;
