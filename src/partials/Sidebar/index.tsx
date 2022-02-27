import {
  Box,
  Divider,
  Heading,
  HStack,
  Skeleton,
  Stack,
} from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import Logo from '../../components/Logo';
import { NavigationItem } from '../../components/Navigation/NavigationItem';
import { currentEnvironmentIndexState, spaceState } from '../../state/space';

export function Sidebar() {
  // eslint-disable-next-line no-unused-vars
  const [spaceData, setSpaceData] = useRecoilState(spaceState);
  // eslint-disable-next-line no-unused-vars
  const [currentEnvironmentIndex, setcurrentEnvironmentIndex] = useRecoilState(
    currentEnvironmentIndexState
  );

  return (
    <Box maxWidth="275px" minWidth="275px">
      <Box paddingX={10} paddingY={15}>
        <HStack>
          <Logo />
          <Heading
            as="h3"
            size="xs"
            textTransform="uppercase"
            letterSpacing="0.5px"
          >
            Contentful Migration App
          </Heading>
        </HStack>
      </Box>
      <Box paddingX={10}>
        <Divider />
      </Box>
      <Box paddingX={10} paddingTop="25px">
        <Heading
          as="h3"
          size="xs"
          textTransform="uppercase"
          letterSpacing="0.5px"
          marginBottom="6"
        >
          Environments
        </Heading>
        {!spaceData ? (
          <Stack>
            <Skeleton height="20px" />
            <Skeleton height="20px" width="85%" />
            <Skeleton height="20px" width="75%" />
          </Stack>
        ) : (
          spaceData?.environmentsWithContentTypes.map(
            ({ environment }, index) => (
              <NavigationItem
                isMain={index === 0}
                active={index === currentEnvironmentIndex}
                handleOnClick={() => setcurrentEnvironmentIndex(index)}
                environment={environment}
                key={environment.name}
              />
            )
          )
        )}
      </Box>
    </Box>
  );
}
