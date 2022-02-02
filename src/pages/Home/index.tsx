import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import Sidebar from '../../partials/Sidebar';
import { spaceState } from '../../recoil/space';

function Home() {
  // eslint-disable-next-line no-unused-vars
  const [spaceData, _] = useRecoilState(spaceState);

  useEffect(() => {
    console.log('spaceData', spaceData);
  }, [spaceData]);

  return (
    <div className="App">
      <Sidebar />
    </div>
  );
}

export default Home;
