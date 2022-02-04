import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { spaceState } from '../../state/space';

export function Header() {
  // eslint-disable-next-line no-unused-vars
  const [spaceData, setSpaceData] = useRecoilState(spaceState);

  useEffect(() => {
    console.log(spaceData);
  }, []);
  return (
    <Box paddingX={10} paddingY={15}>
      <VStack alignItems="flex-start">
        <HStack>
          <Text fontWeight="bold" textTransform="uppercase" fontSize="sm">
            Space Id:
          </Text>
          <Text fontSize="sm">{spaceData?.space?.sys?.id ?? 'N/A'}</Text>
        </HStack>
        <HStack>
          <Text fontWeight="bold" textTransform="uppercase" fontSize="sm">
            Space Name:
          </Text>
          <Text fontSize="sm">{spaceData?.space?.name ?? 'N/A'}</Text>
        </HStack>
      </VStack>
    </Box>
  );
}
