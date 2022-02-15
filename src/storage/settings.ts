import { SettingsProps } from '../state/settings';

const SETTINGS_LOCALSTORAGE_KEY = 'cma_settings';

export const setSettingsInStorage = (
  settings: SettingsProps
): Promise<boolean> =>
  new Promise((resolve, reject) => {
    try {
      localStorage.setItem(SETTINGS_LOCALSTORAGE_KEY, JSON.stringify(settings));
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });

export const getSettingsFromStorage = (): Promise<SettingsProps | null> =>
  new Promise((resolve, reject) => {
    try {
      const settingsInStorage = localStorage.getItem(SETTINGS_LOCALSTORAGE_KEY);

      if (settingsInStorage === null) {
        resolve(null);
      }

      const parsed = JSON.parse(settingsInStorage!) as SettingsProps;
      resolve(parsed);
    } catch (e) {
      reject(e);
    }
  });
