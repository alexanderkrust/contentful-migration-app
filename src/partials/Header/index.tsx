import { Flex, HStack, Skeleton, Text, VStack } from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import { spaceState } from '../../state/space';
import { SettingsButton } from '../../components/Buttons/SettingsButton';

export function Header() {
  // eslint-disable-next-line no-unused-vars
  const [spaceData, setSpaceData] = useRecoilState(spaceState);

  return (
    <Flex
      paddingX={10}
      paddingY={15}
      justifyContent="space-between"
      alignItems="center"
    >
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
      <HStack>
        <SettingsButton />
      </HStack>
    </Flex>
  );
}
