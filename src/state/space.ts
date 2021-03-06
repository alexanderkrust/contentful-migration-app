import { atom, selector } from 'recoil';
import { SpaceData } from '../api';

const SPACE_STATE_KEY = 'spaceState';
const TRIGGER_STATE_KEY = 'triggerState';
const CURRENT_ENVIRONMENT_INDEX_STATE_KEY = 'currentEnvironmentIndexState';
const CURRENT_ENVIRONMENT_STATE_KEY = 'currentEnvironmentState';
const ALL_ENVIRONMENTS_STATE_KEY = 'allEnvironmentsState';

export const spaceState = atom<SpaceData | null>({
  key: SPACE_STATE_KEY,
  default: null,
});

export const currentEnvironmentIndexState = atom<number>({
  key: CURRENT_ENVIRONMENT_INDEX_STATE_KEY,
  default: 0,
});

export const triggerState = atom<boolean>({
  key: TRIGGER_STATE_KEY,
  default: false,
});

export const currentEnvironmentState = selector({
  key: CURRENT_ENVIRONMENT_STATE_KEY,
  get: ({ get }) => {
    const currentIndex = get(currentEnvironmentIndexState);
    const spaceData = get(spaceState);
    return spaceData?.environmentsWithContentTypes[currentIndex];
  },
});

export const allEnvironmentState = selector({
  key: ALL_ENVIRONMENTS_STATE_KEY,
  get: ({ get }) => {
    const spaceData = get(spaceState);
    return spaceData?.environmentsWithContentTypes.map(
      (item) => item.environment
    );
  },
});
