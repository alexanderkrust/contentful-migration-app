import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { spaceState } from '../space';
import { getSettingsFromStorage } from '../../storage/settings';
import { settingsState } from '../settings';

export function Settings() {
  // eslint-disable-next-line no-unused-vars
  const [settings, setSettings] = useRecoilState(settingsState);
  // eslint-disable-next-line no-unused-vars
  const [spaceData, _] = useRecoilState(spaceState);

  useEffect(() => {
    const settingsInStorage = getSettingsFromStorage();

    setSettings(settingsInStorage!);
  }, []);

  useEffect(() => {
    if (spaceData) {
      // Set first environment as mainBranch defaultly
      localStorage.setItem(
        'cma_settings',
        JSON.stringify({
          ...settings,
          mainBranch:
            spaceData?.environmentsWithContentTypes[0].environment.sys.id,
        })
      );
    }

    const settingsInStorage = getSettingsFromStorage();

    if (!settingsInStorage) {
      return;
    }

    // Set mainBranch when settings changed
    if (settingsInStorage.mainBranch !== settings.mainBranch) {
      localStorage.setItem('cma_settings', JSON.stringify(settings));
    }
  }, [settings, spaceData]);

  return null;
}
