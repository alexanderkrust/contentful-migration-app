import { Flex } from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import { MigrateButton } from '../../components/Buttons/MigrateButton';
import { Header } from '../../partials/Header';
import { Main } from '../../partials/Main';

import Sidebar from '../../partials/Sidebar';
import { spaceState } from '../../state/space';

function Home() {
  // eslint-disable-next-line no-unused-vars
  const [spaceData, _] = useRecoilState(spaceState);

  return (
    <>
      <Flex className="App" height="100vh">
        <Sidebar />
        <Flex direction="column" width="100%">
          <Header />
          <Main />
        </Flex>
      </Flex>
      <MigrateButton />
    </>
  );
}

export default Home;
