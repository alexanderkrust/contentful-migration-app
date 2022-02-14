import { atom } from 'recoil';

const SETTINGS_STATE_KEY = 'settingsState';

export interface SettingsProps {
  mainBranch: string | null;
}

export const settingsState = atom<SettingsProps>({
  key: SETTINGS_STATE_KEY,
  default: {
    mainBranch: null,
  } as SettingsProps,
});
