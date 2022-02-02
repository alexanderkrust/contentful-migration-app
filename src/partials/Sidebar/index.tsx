import { Box, Divider, Heading, HStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import Logo from '../../components/Logo';
import { NavigationItem } from '../../components/Navigation/NavigationItem';
import {
  currentEnvironmentIndexState,
  currentEnvironmentState,
  spaceState,
} from '../../recoil/space';

function Sidebar() {
  // eslint-disable-next-line no-unused-vars
  const [spaceData, setSpaceData] = useRecoilState(spaceState);
  // eslint-disable-next-line no-unused-vars
  const [currentEnvironmentIndex, setcurrentEnvironmentIndex] = useRecoilState(
    currentEnvironmentIndexState
  );

  const currentEnvironment = useRecoilValue(currentEnvironmentState);

  useEffect(() => {
    console.log(currentEnvironment);
  }, [currentEnvironment]);
  return (
    <Box width="275px">
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
        {spaceData?.environmentsWithContentTypes.map(
          ({ environment }, index) => (
            <NavigationItem
              active={index === currentEnvironmentIndex}
              handleOnClick={() => setcurrentEnvironmentIndex(index)}
              environment={environment}
              key={environment.name}
            />
          )
        )}
      </Box>
    </Box>
  );
}

export default Sidebar;
