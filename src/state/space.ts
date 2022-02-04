import { atom, selector, useRecoilState } from 'recoil';

import { useEffect } from 'react';
import { getSpaceData, SpaceData } from '../api';

const SPACE_STATE_KEY = 'spaceState';
const TRIGGER_STATE_KEY = 'triggerState';
const CURRENT_ENVIRONMENT_STATE_KEY = 'currentEnvironmentIndexState';

export const spaceState = atom<SpaceData | null>({
  key: SPACE_STATE_KEY,
  default: null,
});

export const currentEnvironmentIndexState = atom<number>({
  key: CURRENT_ENVIRONMENT_STATE_KEY,
  default: 0,
});

export const triggerState = atom<boolean>({
  key: TRIGGER_STATE_KEY,
  default: false,
});

export const currentEnvironmentState = selector({
  key: 'currentEnvironmentState',
  get: ({ get }) => {
    const currentIndex = get(currentEnvironmentIndexState);
    const spaceData = get(spaceState);
    return spaceData?.environmentsWithContentTypes[currentIndex];
  },
});

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
