import { Box, Container, Flex } from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import { MigrateButton } from '../../components/Buttons/MigrateButton';

import { Header } from '../../partials/Header';
import { Main } from '../../partials/Main';

import { Sidebar } from '../../partials/Sidebar';
import { spaceState } from '../../state/space';

function Home() {
  // eslint-disable-next-line no-unused-vars
  const [spaceData, _] = useRecoilState(spaceState);

  return (
    <Container maxW="1440px" paddingTop="5" pos="relative">
      <Flex className="App" pos="relative">
        <Sidebar />
        <Box marginLeft="10" width="100%" pos="relative">
          <Header />
          <Main />
          <MigrateButton />
        </Box>
      </Flex>
    </Container>
  );
}

export default Home;
