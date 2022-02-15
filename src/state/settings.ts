import { atom, selector } from 'recoil';
import { spaceState } from './space';

const SETTINGS_STATE_KEY = 'settingsState';
const MAIN_BRANCH_STATE_KEY = 'mainBranchState';
export interface SettingsProps {
  mainBranch: string | null;
}

export const settingsState = atom<SettingsProps>({
  key: SETTINGS_STATE_KEY,
  default: {
    mainBranch: null,
  } as SettingsProps,
});

export const mainBranchState = selector({
  key: MAIN_BRANCH_STATE_KEY,
  get: ({ get }) => {
    const spaceData = get(spaceState);
    const settingsData = get(settingsState);

    const mainBranch = spaceData?.environmentsWithContentTypes.find(
      (env) => env.environment.sys.id === settingsData.mainBranch
    );

    return mainBranch;
  },
});
