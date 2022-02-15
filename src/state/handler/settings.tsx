import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { spaceState } from '../space';
import {
  getSettingsFromStorage,
  setSettingsInStorage,
} from '../../storage/settings';
import { settingsState } from '../settings';
import { SpaceData } from '../../api';

export function Settings() {
  // eslint-disable-next-line no-unused-vars
  const [settings, setSettings] = useRecoilState(settingsState);
  // eslint-disable-next-line no-unused-vars
  const [spaceData, _] = useRecoilState(spaceState);

  useEffect(() => {
    const initSettings = async () => {
      const settingsInStorage = await getSettingsFromStorage();
      if (!settingsInStorage) {
        return;
      }
      setSettings(settingsInStorage);
    };

    initSettings();
  }, []);

  useEffect(() => {
    const setDefaultMainBranch = async (spaceDataParam: SpaceData) => {
      const settingsInStorage = await getSettingsFromStorage();
      if (settingsInStorage && settingsInStorage.mainBranch) {
        return;
      }

      const data = {
        ...settings,
        mainBranch:
          spaceDataParam?.environmentsWithContentTypes[0].environment.sys.id,
      };

      setSettings(data);
      await setSettingsInStorage(data);
    };

    if (!spaceData) {
      return;
    }

    setDefaultMainBranch(spaceData);
  }, [spaceData]);

  return null;
}
