import { useRecoilState } from 'recoil';
import { useEffect } from 'react';
import { getSpaceData } from '../../api';
import { spaceState, triggerState } from '../space';

export function ContentfulSpace() {
  // eslint-disable-next-line no-unused-vars
  const [spaceData, setSpaceData] = useRecoilState(spaceState);
  const [trigger, setTrigger] = useRecoilState(triggerState);

  useEffect(() => {
    const fetchSpaceData = async () => {
      const response = await getSpaceData();
      setSpaceData(response);
    };

    if (!spaceData) {
      fetchSpaceData();
    }

    if (trigger) {
      fetchSpaceData();
      setTrigger(false);
    }
  }, [trigger, spaceData]);

  return null;
}
