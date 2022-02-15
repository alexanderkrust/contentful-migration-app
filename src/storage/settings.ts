import { SettingsProps } from '../state/settings';

const SETTINGS_LOCALSTORAGE_KEY = 'cma_settings';

export const setSettingsInStorage = (settings: SettingsProps) => {
  localStorage.setItem(SETTINGS_LOCALSTORAGE_KEY, JSON.stringify(settings));
};

export const getSettingsFromStorage = (): SettingsProps | null => {
  const settingsInStorage = localStorage.getItem(SETTINGS_LOCALSTORAGE_KEY);

  if (!settingsInStorage) {
    return null;
  }
  return JSON.parse(settingsInStorage) as SettingsProps;
};
