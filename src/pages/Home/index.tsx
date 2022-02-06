import { Flex } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { MigratePanel } from '../../components/MigratePanel';
import { Header } from '../../partials/Header';
import { Main } from '../../partials/Main';

import Sidebar from '../../partials/Sidebar';
import { spaceState } from '../../state/space';

function Home() {
  // eslint-disable-next-line no-unused-vars
  const [spaceData, _] = useRecoilState(spaceState);

  useEffect(() => {
    console.log('spaceData', spaceData);
  }, [spaceData]);

  return (
    <>
      <Flex className="App" height="100vh">
        <Sidebar />
        <Flex direction="column" width="100%">
          <Header />
          <Main />
        </Flex>
      </Flex>
      <MigratePanel />
    </>
  );
}

export default Home;
