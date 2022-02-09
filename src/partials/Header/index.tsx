import { Box, HStack, Skeleton, Text, VStack } from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import { spaceState } from '../../state/space';

export function Header() {
  // eslint-disable-next-line no-unused-vars
  const [spaceData, setSpaceData] = useRecoilState(spaceState);

  return (
    <Box paddingX={10} paddingY={15}>
      <VStack alignItems="flex-start">
        <HStack>
          <Text fontWeight="bold" textTransform="uppercase" fontSize="sm">
            Space Id:
          </Text>
          {spaceData ? (
            <Text fontSize="sm">{spaceData?.space?.sys?.id ?? 'N/A'}</Text>
          ) : (
            <Skeleton height="20px" width="150px" />
          )}
        </HStack>
        <HStack>
          <Text fontWeight="bold" textTransform="uppercase" fontSize="sm">
            Space Name:
          </Text>
          {spaceData ? (
            <Text fontSize="sm">{spaceData?.space?.name ?? 'N/A'}</Text>
          ) : (
            <Skeleton height="20px" width="100px" />
          )}
        </HStack>
      </VStack>
    </Box>
  );
}
